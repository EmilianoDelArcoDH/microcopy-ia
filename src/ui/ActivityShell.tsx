import { useEffect, useMemo, useState } from 'react';
import type { ActivityConfig, ActivityId, ActivityState, BlockProps, LangCode, QueryState, Variant } from '../core/types';
import { ACTIVITY_REGISTRY } from '../core/activityRegistry';
import { validarActividad } from '../core/validators';
import { activityStorageKey } from '../core/query';
import { activityMicrocopyIA01Localized } from '../activities/microcopy-ia-01';
import { activityMicrocopyIA02Localized } from '../activities/microcopy-ia-02';
import { activityMicrocopyIA03Localized } from '../activities/microcopy-ia-03';
import { PromptBuilder } from './blocks/PromptBuilder';
import { GroqGenerate } from './blocks/GroqGenerate';
import { OptionsPicker } from './blocks/OptionsPicker';
import { RationaleInput } from './blocks/RationaleInput';
import { Checklist } from './blocks/Checklist';
import { ValidationResults } from './blocks/ValidationResults';
import { BrokenUISample } from './blocks/BrokenUISample';
import { AuditTable } from './blocks/AuditTable';

type Props = {
    activityId: ActivityId;
    lang: LangCode;
    variant: Variant;
};

type BlockComponent = (props: BlockProps) => JSX.Element;
type StageId = 1 | 2 | 3;

const localizedByActivity = {
    'microcopy-ia-01': activityMicrocopyIA01Localized,
    'microcopy-ia-02': activityMicrocopyIA02Localized,
    'microcopy-ia-03': activityMicrocopyIA03Localized,
} as const;

const shellText: Record<
    LangCode,
    {
        blocks: string;
        checklist: string;
        progressStarted: string;
        progressStartHint: string;
        reviewTitle: string;
        reviewHint: string;
        blockNotFound: string;
        validate: string;
        stage1: string;
        stage2: string;
        stage3: string;
    }
> = {
    es: {
        blocks: 'Bloques',
        checklist: 'Checklist',
        progressStarted: 'Progreso iniciado',
        progressStartHint: 'Comenzá por el primer bloque',
        reviewTitle: 'Repaso',
        reviewHint: 'Antes de validar, verificá que cumplís todas estas reglas.',
        blockNotFound: 'Bloque no encontrado',
        validate: 'Validar',
        stage1: 'Etapa 1 · Construcción manual del prompt',
        stage2: 'Etapa 2 · Generación con IA',
        stage3: 'Etapa 3 · Validación humana',
    },
    en: {
        blocks: 'Blocks',
        checklist: 'Checklist',
        progressStarted: 'Progress started',
        progressStartHint: 'Start with the first block',
        reviewTitle: 'Review',
        reviewHint: 'Before validating, make sure you meet all these rules.',
        blockNotFound: 'Block not found',
        validate: 'Validate',
        stage1: 'Stage 1 · Manual prompt creation',
        stage2: 'Stage 2 · AI generation',
        stage3: 'Stage 3 · Human validation',
    },
    pt: {
        blocks: 'Blocos',
        checklist: 'Checklist',
        progressStarted: 'Progresso iniciado',
        progressStartHint: 'Comece pelo primeiro bloco',
        reviewTitle: 'Revisão',
        reviewHint: 'Antes de validar, confira se você cumpre todas estas regras.',
        blockNotFound: 'Bloco não encontrado',
        validate: 'Validar',
        stage1: 'Etapa 1 · Construção manual do prompt',
        stage2: 'Etapa 2 · Geração com IA',
        stage3: 'Etapa 3 · Validação humana',
    },
};


const blockComponentMap: Record<string, BlockComponent> = {
    PromptBuilder,
    GroqGenerate,
    OptionsPicker,
    RationaleInput,
    Checklist,
    ValidationResults,
    BrokenUISample,
    AuditTable,
};

function getStageForBlock(blockId: keyof typeof blockComponentMap): StageId {
    if (blockId === 'PromptBuilder' || blockId === 'BrokenUISample') {
        return 1;
    }
    if (blockId === 'GroqGenerate' || blockId === 'OptionsPicker' || blockId === 'AuditTable') {
        return 2;
    }
    return 3;
}

function buildInitialState(config: ActivityConfig): ActivityState {
    return {
        promptUsuario: '',
        promptAlumno: '',
        erroresPrompt: [],
        promptEstructuraOK: false,
        opcionesIA: [],
        opcionElegida: '',
        justificacion: '',
        tablaAuditoria: Array.isArray(config.inputsIniciales.filasAuditoria)
            ? (config.inputsIniciales.filasAuditoria as ActivityState['tablaAuditoria'])
            : [],
        checklistMarcado: [],
        resultadosValidacion: null,
    };
}

function loadState(config: ActivityConfig, query: QueryState): ActivityState {
    const key = activityStorageKey(query);
    const raw = window.localStorage.getItem(key);

    if (!raw) {
        return buildInitialState(config);
    }

    try {
        const parsed = JSON.parse(raw) as ActivityState;
        const base = buildInitialState(config);
        return {
            ...base,
            ...parsed,
            promptAlumno: parsed.promptAlumno ?? parsed.promptUsuario ?? '',
            erroresPrompt: Array.isArray(parsed.erroresPrompt) ? parsed.erroresPrompt : [],
            promptEstructuraOK: Boolean(parsed.promptEstructuraOK),
            tablaAuditoria: parsed.tablaAuditoria?.length ? parsed.tablaAuditoria : base.tablaAuditoria,
        };
    } catch {
        return buildInitialState(config);
    }
}

export function ActivityShell({ activityId, lang, variant }: Props): JSX.Element {
    const configBase = ACTIVITY_REGISTRY[activityId];
    const config = useMemo<ActivityConfig>(() => {
        const localizedContent = localizedByActivity[activityId][lang];

        return {
            ...configBase,
            titulo: localizedContent.titulo,
            objetivo: localizedContent.objetivo,
            reglasValidacion: localizedContent.reglasValidacion,
            checklistHumano: localizedContent.checklistHumano,
            inputsIniciales: {
                ...configBase.inputsIniciales,
                ...localizedContent.inputsIniciales,
            },
        };
    }, [activityId, configBase, lang]);
    const t = shellText[lang];
    const query = useMemo<QueryState>(() => ({ a: activityId, lang, variant }), [activityId, lang, variant]);
    const [state, setState] = useState<ActivityState>(() => loadState(config, query));

    const totalChecks = config.checklistHumano.length;
    const checksCompletados = state.checklistMarcado.length;
    const tieneTrabajoBase =
        state.promptAlumno.trim().length > 0 ||
        state.opcionElegida.trim().length > 0 ||
        state.justificacion.trim().length > 0 ||
        state.tablaAuditoria.some(
            (fila) => fila.propuesta.trim().length > 0 || fila.label.trim().length > 0 || fila.placeholder.trim().length > 0,
        ) ||
        state.checklistMarcado.length > 0 ||
        state.promptEstructuraOK;

    useEffect(() => {
        setState(loadState(config, query));
    }, [config, query]);

    useEffect(() => {
        const key = activityStorageKey(query);
        window.localStorage.setItem(key, JSON.stringify(state));
    }, [query, state]);

    const onValidate = (): void => {
        const resultado = validarActividad(config, state, lang);
        setState((prev) => ({
            ...prev,
            resultadosValidacion: resultado,
        }));
    };

    const blocksVisibles = config.ui.blocks.filter((blockId) => !(blockId === 'GroqGenerate' && !config.supportsAI));
    const blocksByStage = blocksVisibles.reduce<Record<StageId, typeof blocksVisibles>>(
        (acc, blockId) => {
            const stage = getStageForBlock(blockId);
            acc[stage].push(blockId);
            return acc;
        },
        { 1: [], 2: [], 3: [] },
    );

    const stageMeta: Array<{ id: StageId; title: string }> = [
        { id: 1, title: t.stage1 },
        { id: 2, title: t.stage2 },
        { id: 3, title: t.stage3 },
    ];

    return (
        <section className="card activity-shell">
            <header className="card-header activity-header">
                <h2>{config.titulo}</h2>
                <p>{config.objetivo}</p>
            </header>

            <div className="meta-row activity-meta">
                <span className="badge badge-soft">{t.blocks}: {config.ui.blocks.length}</span>
                <span className="badge badge-soft">{t.checklist}: {checksCompletados}/{totalChecks}</span>
                <span className={`badge ${tieneTrabajoBase ? 'badge-soft' : 'badge-warning'}`}>
                    {tieneTrabajoBase ? t.progressStarted : t.progressStartHint}
                </span>
            </div>

            <div className="card repaso repaso-card">
                <h3>{t.reviewTitle}</h3>
                <p className="muted">{t.reviewHint}</p>
                <ul>
                    {config.reglasValidacion.map((regla) => (
                        <li key={regla}>{regla}</li>
                    ))}
                </ul>
            </div>

            {stageMeta.map((stage) => {
                const stageBlocks = blocksByStage[stage.id];
                if (!stageBlocks.length) {
                    return null;
                }

                return (
                    <section key={stage.id} className="stage-group">
                        <header className="stage-group-header">
                            <h3>{stage.title}</h3>
                        </header>
                        <div className="stage-group-body">
                            {stageBlocks.map((blockId) => {
                                const Component = blockComponentMap[blockId];
                                if (!Component) {
                                    return (
                                        <div key={blockId} className="alert alert-error">
                                            {t.blockNotFound}: {blockId}
                                        </div>
                                    );
                                }
                                return (
                                    <div key={blockId} className="block-wrap stage-card">
                                        <Component config={config} state={state} setState={setState} lang={lang} variant={variant} />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
            })}

            <div className="actions actions-final">
                <button type="button" className="btn btn-primary" onClick={onValidate}>
                    {t.validate}
                </button>
            </div>
        </section>
    );
}