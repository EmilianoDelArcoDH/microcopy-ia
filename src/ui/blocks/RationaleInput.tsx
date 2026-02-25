import type { BlockProps } from '../../core/types';

const texts = {
  es: {
    title: 'Paso 4 · Justificación',
    hint: 'Explicá por qué tu elección es más clara y accesible.',
    question: '¿Por qué elegiste esa opción?',
    placeholder: 'Escribí una justificación clara (mínimo 30 caracteres)',
  },
  en: {
    title: 'Step 4 · Rationale',
    hint: 'Explain why your choice is clearer and more accessible.',
    question: 'Why did you choose that option?',
    placeholder: 'Write a clear rationale (minimum 30 characters)',
  },
  pt: {
    title: 'Passo 4 · Justificativa',
    hint: 'Explique por que sua escolha é mais clara e acessível.',
    question: 'Por que você escolheu essa opção?',
    placeholder: 'Escreva uma justificativa clara (mínimo 30 caracteres)',
  },
} as const;

export function RationaleInput({ state, setState, lang }: BlockProps): JSX.Element {
  const t = texts[lang];
  return (
    <section>
      <h3>{t.title}</h3>
      <p className="muted">{t.hint}</p>
      <label className="field">
        {t.question}
        <textarea
          rows={4}
          value={state.justificacion}
          onChange={(event) =>
            setState((prev) => ({
              ...prev,
              justificacion: event.target.value,
            }))
          }
          placeholder={t.placeholder}
        />
      </label>
    </section>
  );
}