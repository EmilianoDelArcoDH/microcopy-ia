import { useMemo, useState } from 'react';
import type { BlockProps } from '../../core/types';
import type { AIClient } from '../../services/aiClient';
import { createDefaultAIClient, hasGroqApiKey } from '../../services/aiClient';

const texts = {
  es: {
    needPrompt: 'Primero validá tu prompt (Etapa 1).',
    generationError: 'No se pudieron generar opciones en este momento.',
    title: 'Paso 2 · Generar opciones',
    usingGroq: 'Configuración detectada: se usa Groq.',
    usingMock: 'No hay VITE_GROQ_API_KEY. Se usa MockAIClient como fallback.',
    loading: 'Generando...',
    button: 'Generar 3 opciones',
    stage1Required: 'Primero validá tu prompt (Etapa 1).',
  },
  en: {
    needPrompt: 'First validate your prompt (Stage 1).',
    generationError: 'Options could not be generated right now.',
    title: 'Step 2 · Generate options',
    usingGroq: 'Configuration detected: Groq is being used.',
    usingMock: 'VITE_GROQ_API_KEY was not found. MockAIClient is used as fallback.',
    loading: 'Generating...',
    button: 'Generate 3 options',
    stage1Required: 'First validate your prompt (Stage 1).',
  },
  pt: {
    needPrompt: 'Primeiro valide seu prompt (Etapa 1).',
    generationError: 'Não foi possível gerar opções neste momento.',
    title: 'Passo 2 · Gerar opções',
    usingGroq: 'Configuração detectada: usando Groq.',
    usingMock: 'Não há VITE_GROQ_API_KEY. MockAIClient é usado como fallback.',
    loading: 'Gerando...',
    button: 'Gerar 3 opções',
    stage1Required: 'Primeiro valide seu prompt (Etapa 1).',
  },
} as const;

export function GroqGenerate({ state, setState, lang }: BlockProps): JSX.Element {
  const t = texts[lang];
  const client = useMemo<AIClient>(() => createDefaultAIClient(), []);
  const usaGroq = hasGroqApiKey();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onGenerate = async (): Promise<void> => {
    if (!state.promptEstructuraOK || !state.promptAlumno.trim()) {
      setError(t.needPrompt);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const opciones = await client.generateMicrocopy(state.promptAlumno);
      setState((prev) => ({
        ...prev,
        opcionesIA: opciones,
        opcionElegida: '',
      }));
    } catch {
      setError(t.generationError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h3>{t.title}</h3>
      <p>
        {usaGroq
          ? t.usingGroq
          : t.usingMock}
      </p>
      <button
        type="button"
        className="btn"
        onClick={onGenerate}
        disabled={loading || !state.promptEstructuraOK}
      >
        {loading ? t.loading : t.button}
      </button>
      {!state.promptEstructuraOK ? <p className="alert">{t.stage1Required}</p> : null}
      {error ? <p className="alert alert-error">{error}</p> : null}
    </section>
  );
}