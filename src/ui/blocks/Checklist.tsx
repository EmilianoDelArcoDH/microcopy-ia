import type { BlockProps } from '../../core/types';

const texts = {
  es: {
    title: 'Paso 5 · Checklist humano',
    progress: (done: number, total: number) => `Marcá los criterios que ya cumpliste (${done}/${total}).`,
  },
  en: {
    title: 'Step 5 · Human checklist',
    progress: (done: number, total: number) => `Mark the criteria you already meet (${done}/${total}).`,
  },
  pt: {
    title: 'Passo 5 · Checklist humano',
    progress: (done: number, total: number) => `Marque os critérios que você já cumpre (${done}/${total}).`,
  },
} as const;

export function Checklist({ config, state, setState, lang }: BlockProps): JSX.Element {
  const t = texts[lang];
  const toggle = (item: string): void => {
    setState((prev) => {
      const existe = prev.checklistMarcado.includes(item);
      return {
        ...prev,
        checklistMarcado: existe
          ? prev.checklistMarcado.filter((value) => value !== item)
          : [...prev.checklistMarcado, item],
      };
    });
  };

  return (
    <section>
      <h3>{t.title}</h3>
      <p className="muted">
        {t.progress(state.checklistMarcado.length, config.checklistHumano.length)}
      </p>
      <ul className="checklist">
        {config.checklistHumano.map((item) => (
          <li key={item}>
            <label>
              <input
                type="checkbox"
                checked={state.checklistMarcado.includes(item)}
                onChange={() => toggle(item)}
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}