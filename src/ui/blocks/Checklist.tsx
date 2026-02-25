import type { BlockProps } from '../../core/types';

const texts = {
  es: {
    title: 'Paso 5 · Checklist humano',
    subtitle: 'Antes de finalizar, confirmá que tu opción cumple todos los criterios.',
    progress: (done: number, total: number) => `Marcá los criterios que ya cumpliste (${done}/${total}).`,
    complete: 'Checklist completo. Ya podés finalizar la actividad.',
  },
  en: {
    title: 'Step 5 · Human checklist',
    subtitle: 'Before finishing, confirm your option meets every criterion.',
    progress: (done: number, total: number) => `Mark the criteria you already meet (${done}/${total}).`,
    complete: 'Checklist complete. You can now finish the activity.',
  },
  pt: {
    title: 'Passo 5 · Checklist humano',
    subtitle: 'Antes de finalizar, confirme que sua opção atende a todos os critérios.',
    progress: (done: number, total: number) => `Marque os critérios que você já cumpre (${done}/${total}).`,
    complete: 'Checklist completo. Agora você pode finalizar a atividade.',
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
      <p className="muted">{t.subtitle}</p>
      <p className="muted">
        {t.progress(state.checklistMarcado.length, config.checklistHumano.length)}
      </p>
      {state.checklistMarcado.length === config.checklistHumano.length ? (
        <p className="alert alert-ok">{t.complete}</p>
      ) : null}
      <ul className="checklist">
        {config.checklistHumano.map((item) => (
          <li key={item} className={state.checklistMarcado.includes(item) ? 'checklist-item checklist-item-done' : 'checklist-item'}>
            <label className="checklist-label">
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