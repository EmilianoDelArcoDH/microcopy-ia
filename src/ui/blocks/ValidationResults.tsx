import type { BlockProps } from '../../core/types';

const texts = {
  es: {
    title: 'Paso final · Resultado de validación',
    empty: 'Todavía no corriste la validación. Completá los pasos y luego presioná “Validar”.',
    ok: 'OK: no se encontraron errores.',
    count: (n: number) => `Se encontraron ${n} error(es):`,
  },
  en: {
    title: 'Final step · Validation results',
    empty: 'You have not run validation yet. Complete the steps and then press “Validate”.',
    ok: 'OK: no errors were found.',
    count: (n: number) => `${n} error(s) were found:`,
  },
  pt: {
    title: 'Passo final · Resultado da validação',
    empty: 'Você ainda não executou a validação. Complete os passos e depois clique em “Validar”.',
    ok: 'OK: nenhum erro foi encontrado.',
    count: (n: number) => `Foram encontrados ${n} erro(s):`,
  },
} as const;

export function ValidationResults({ state, lang }: BlockProps): JSX.Element {
  const t = texts[lang];
  const resultado = state.resultadosValidacion;

  if (!resultado) {
    return (
      <section>
        <h3>{t.title}</h3>
        <p className="alert">{t.empty}</p>
      </section>
    );
  }

  return (
    <section>
      <h3>{t.title}</h3>
      {resultado.ok ? (
        <p className="alert alert-ok">{t.ok}</p>
      ) : (
        <div className="alert alert-error">
          <p>{t.count(resultado.errores.length)}</p>
          <ul>
            {resultado.errores.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}