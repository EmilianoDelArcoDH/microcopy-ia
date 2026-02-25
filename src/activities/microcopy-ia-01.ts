import type { ActivityConfig, LangCode } from '../core/types';

export interface ActivityLocalizedData {
    titulo: string;
    objetivo: string;
    reglasValidacion: string[];
    checklistHumano: string[];
    inputsIniciales: Record<string, unknown>;
}

export const activityMicrocopyIA01: ActivityConfig = {
    id: 'microcopy-ia-01',
    titulo: 'Actividad 01 — Prompt guiado',
    objetivo: 'Construir un prompt claro para generar microcopy accesible en español neutro.',
    supportsAI: true,
    inputsIniciales: {
        textoOriginal: 'Click acá',
        contexto: 'Descarga un reporte mensual en PDF.',
        maxWords: 5,
        idioma: 'es',
    },
    ui: {
        blocks: ['PromptBuilder', 'GroqGenerate', 'OptionsPicker', 'RationaleInput', 'Checklist', 'ValidationResults'],
    },
    reglasValidacion: [
        'El prompt debe mencionar Texto original.',
        'El prompt debe mencionar Contexto.',
        'El prompt debe incluir un máximo de palabras.',
        'El prompt debe pedir español neutro.',
        'El prompt debe pedir exactamente 3 opciones.',
    ],
    checklistHumano: [
        'Se entiende sin contexto extra.',
        'Describe la acción real.',
        'Es breve.',
        'No promete algo falso.',
        'Mantiene el tono correcto.',
    ],
};

export const activityMicrocopyIA01Localized: Record<LangCode, ActivityLocalizedData> = {
    es: {
        titulo: 'Actividad 01 — Prompt guiado',
        objetivo: 'Construir un prompt claro para generar microcopy accesible en español neutro.',
        reglasValidacion: [
            'El prompt debe mencionar Texto original.',
            'El prompt debe mencionar Contexto.',
            'El prompt debe incluir un máximo de palabras.',
            'El prompt debe pedir español neutro.',
            'El prompt debe pedir exactamente 3 opciones.',
        ],
        checklistHumano: [
            'Se entiende sin contexto extra.',
            'Describe la acción real.',
            'Es breve.',
            'No promete algo falso.',
            'Mantiene el tono correcto.',
        ],
        inputsIniciales: {
            textoOriginal: 'Click acá',
            contexto: 'Descarga un reporte mensual en PDF.',
        },
    },
    en: {
        titulo: 'Activity 01 — Guided prompt',
        objetivo: 'Build a clear prompt to generate accessible microcopy in neutral Spanish.',
        reglasValidacion: [
            'The prompt must mention Texto original.',
            'The prompt must mention Contexto.',
            'The prompt must include a maximum word limit.',
            'The prompt must ask for neutral Spanish.',
            'The prompt must request exactly 3 options.',
        ],
        checklistHumano: [
            'It is understandable without extra context.',
            'It describes the real action.',
            'It is brief.',
            'It does not promise something false.',
            'It keeps the right tone.',
        ],
        inputsIniciales: {
            textoOriginal: 'Click here',
            contexto: 'Download a monthly PDF report.',
        },
    },
    pt: {
        titulo: 'Atividade 01 — Prompt guiado',
        objetivo: 'Construir um prompt claro para gerar microcopy acessível em espanhol neutro.',
        reglasValidacion: [
            'O prompt deve mencionar Texto original.',
            'O prompt deve mencionar Contexto.',
            'O prompt deve incluir um máximo de palavras.',
            'O prompt deve pedir espanhol neutro.',
            'O prompt deve pedir exatamente 3 opções.',
        ],
        checklistHumano: [
            'Entende-se sem contexto extra.',
            'Descreve a ação real.',
            'É breve.',
            'Não promete algo falso.',
            'Mantém o tom correto.',
        ],
        inputsIniciales: {
            textoOriginal: 'Clique aqui',
            contexto: 'Baixe um relatório mensal em PDF.',
        },
    },
};