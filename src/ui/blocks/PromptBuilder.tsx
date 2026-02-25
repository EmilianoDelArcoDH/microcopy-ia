import type { BlockProps } from '../../core/types';
import { buildMicrocopyPrompt } from '../../services/aiClient';
import { validarEstructuraPrompt } from '../../core/validators/activity01';

const texts = {
  es: {
    title: 'Paso 1 · Armado del prompt',
    description: 'Construí un prompt claro para pedir alternativas de microcopy accesible.',
    source: 'Texto original:',
    context: 'Contexto:',
    max: 'Máximo:',
    words: 'palabras',
    helperTitle: 'Guía visual (referencia)',
    helperDescription: 'Usá esta estructura como guía. El texto final debe ser escrito por vos en el campo editable.',
    validateStructure: 'Validar estructura del prompt (Etapa 1)',
    stage1Ok: 'Estructura del prompt aprobada. Ya podés pasar a la Etapa 2.',
    finalPrompt: 'Prompt final del alumno',
    placeholder: 'Escribí o editá tu prompt acá',
  },
  en: {
    title: 'Step 1 · Build the prompt',
    description: 'Create a clear prompt to request accessible microcopy alternatives.',
    source: 'Original text:',
    context: 'Context:',
    max: 'Maximum:',
    words: 'words',
    helperTitle: 'Visual guide (reference)',
    helperDescription: 'Use this structure as reference. Final prompt text must be written by you in the editable field.',
    validateStructure: 'Validate prompt structure (Stage 1)',
    stage1Ok: 'Prompt structure approved. You can now move to Stage 2.',
    finalPrompt: 'Student final prompt',
    placeholder: 'Write or edit your prompt here',
  },
  pt: {
    title: 'Passo 1 · Montagem do prompt',
    description: 'Crie um prompt claro para pedir alternativas de microcopy acessível.',
    source: 'Texto original:',
    context: 'Contexto:',
    max: 'Máximo:',
    words: 'palavras',
    helperTitle: 'Guia visual (referência)',
    helperDescription: 'Use esta estrutura como referência. O texto final do prompt deve ser escrito por você no campo editável.',
    validateStructure: 'Validar estrutura do prompt (Etapa 1)',
    stage1Ok: 'Estrutura do prompt aprovada. Você já pode ir para a Etapa 2.',
    finalPrompt: 'Prompt final do aluno',
    placeholder: 'Escreva ou edite seu prompt aqui',
  },
} as const;

export function PromptBuilder({ config, state, setState, lang }: BlockProps): JSX.Element {
  const t = texts[lang];
  const textoOriginal = String(config.inputsIniciales.textoOriginal ?? '');
  const contexto = String(config.inputsIniciales.contexto ?? '');
  const maxWords = Number(config.inputsIniciales.maxWords ?? 5);

  const ejemploPrompt = buildMicrocopyPrompt({
    textoOriginal,
    contexto,
    maxWords,
    lang,
  });

  const validarEstructura = (): void => {
    const errores = validarEstructuraPrompt(state.promptAlumno, lang);
    setState((prev) => ({
      ...prev,
      erroresPrompt: errores,
      promptEstructuraOK: errores.length === 0,
      opcionesIA: errores.length === 0 ? prev.opcionesIA : [],
      opcionElegida: errores.length === 0 ? prev.opcionElegida : '',
      resultadosValidacion: null,
    }));
  };

  return (
    <section>
      <h3>{t.title}</h3>
      <p>{t.description}</p>

      <div className="grid-two">
        <p>
          <strong>{t.source}</strong> {textoOriginal}
        </p>
        <p>
          <strong>{t.context}</strong> {contexto}
        </p>
      </div>

      <p>
        <strong>{t.max}</strong> {maxWords} {t.words}
      </p>

      <div className="helper-box">
        <h4>{t.helperTitle}</h4>
        <p className="muted">{t.helperDescription}</p>
        <pre className="prompt-helper">{ejemploPrompt}</pre>
      </div>

      <label className="field">
        {t.finalPrompt}
        <textarea
          rows={7}
          value={state.promptAlumno}
          onChange={(event) =>
            setState((prev) => ({
              ...prev,
              promptAlumno: event.target.value,
              promptUsuario: event.target.value,
              promptEstructuraOK: false,
              erroresPrompt: [],
              opcionesIA: [],
              opcionElegida: '',
              resultadosValidacion: null,
            }))
          }
          placeholder={t.placeholder}
        />
      </label>

      <button type="button" className="btn btn-primary" onClick={validarEstructura}>
        {t.validateStructure}
      </button>

      {state.erroresPrompt.length > 0 ? (
        <div className="alert alert-error">
          <ul>
            {state.erroresPrompt.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.promptEstructuraOK ? <p className="alert alert-ok">{t.stage1Ok}</p> : null}
    </section>
  );
}