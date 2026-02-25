import type { BlockProps } from '../../core/types';

const texts = {
  es: {
    title: 'Paso 1 · Detectá problemas de microcopy',
    description: 'Leé esta UI simulada y detectá textos genéricos o poco claros:',
    button: 'Click acá',
    link: 'Ver más',
    error: 'Error 502: bad gateway',
    placeholder: 'Tu dato',
  },
  en: {
    title: 'Step 1 · Detect microcopy issues',
    description: 'Read this simulated UI and detect generic or unclear text:',
    button: 'Click here',
    link: 'See more',
    error: 'Error 502: bad gateway',
    placeholder: 'Your data',
  },
  pt: {
    title: 'Passo 1 · Detecte problemas de microcopy',
    description: 'Leia esta UI simulada e detecte textos genéricos ou pouco claros:',
    button: 'Clique aqui',
    link: 'Ver mais',
    error: 'Erro 502: bad gateway',
    placeholder: 'Seu dado',
  },
} as const;

export function BrokenUISample({ lang }: BlockProps): JSX.Element {
  const t = texts[lang];
  return (
    <section>
      <h3>{t.title}</h3>
      <p>{t.description}</p>
      <div className="broken-ui">
        <button type="button" className="btn">{t.button}</button>
        <a href="#" onClick={(event) => event.preventDefault()}>
          {t.link}
        </a>
        <p className="error-tech">{t.error}</p>
        <input type="text" placeholder={t.placeholder} />
      </div>
    </section>
  );
}