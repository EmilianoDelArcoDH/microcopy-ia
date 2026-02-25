import type { AuditRow, BlockProps } from '../../core/types';

const texts = {
  es: {
    title: 'Paso 2 · Proponé mejoras',
    hint: 'Completá cada fila con una versión más clara, específica y accionable.',
    headers: ['Elemento', 'Original', 'Propuesta final', 'Label (solo input)', 'Placeholder (solo input)'],
    rowTypes: { boton: 'botón', link: 'link', error: 'error', input: 'input' },
    proposalPlaceholder: 'Escribí la mejora',
    labelPlaceholder: 'Ej: Correo electrónico',
    inputPlaceholder: 'Ej: nombre@dominio.com',
  },
  en: {
    title: 'Step 2 · Propose improvements',
    hint: 'Complete each row with a clearer, more specific and actionable version.',
    headers: ['Element', 'Original', 'Final proposal', 'Label (input only)', 'Placeholder (input only)'],
    rowTypes: { boton: 'button', link: 'link', error: 'error', input: 'input' },
    proposalPlaceholder: 'Write the improved text',
    labelPlaceholder: 'Eg: Email address',
    inputPlaceholder: 'Eg: name@domain.com',
  },
  pt: {
    title: 'Passo 2 · Proponha melhorias',
    hint: 'Complete cada linha com uma versão mais clara, específica e acionável.',
    headers: ['Elemento', 'Original', 'Proposta final', 'Label (somente input)', 'Placeholder (somente input)'],
    rowTypes: { boton: 'botão', link: 'link', error: 'erro', input: 'input' },
    proposalPlaceholder: 'Escreva a melhoria',
    labelPlaceholder: 'Ex: E-mail',
    inputPlaceholder: 'Ex: nome@dominio.com',
  },
} as const;

export function AuditTable({ state, setState, lang }: BlockProps): JSX.Element {
  const t = texts[lang];
  const actualizarFila = (rowId: string, patch: Partial<AuditRow>): void => {
    setState((prev) => ({
      ...prev,
      tablaAuditoria: prev.tablaAuditoria.map((fila) =>
        fila.id === rowId
          ? {
              ...fila,
              ...patch,
            }
          : fila,
      ),
    }));
  };

  return (
    <section>
      <h3>{t.title}</h3>
      <p className="muted">{t.hint}</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.headers[0]}</th>
              <th>{t.headers[1]}</th>
              <th>{t.headers[2]}</th>
              <th>{t.headers[3]}</th>
              <th>{t.headers[4]}</th>
            </tr>
          </thead>
          <tbody>
            {state.tablaAuditoria.map((fila) => (
              <tr key={fila.id}>
                <td>{t.rowTypes[fila.tipo]}</td>
                <td>{fila.original}</td>
                <td>
                  <input
                    type="text"
                    value={fila.propuesta}
                    onChange={(event) => actualizarFila(fila.id, { propuesta: event.target.value })}
                    placeholder={t.proposalPlaceholder}
                  />
                </td>
                <td>
                  {fila.tipo === 'input' ? (
                    <input
                      type="text"
                      value={fila.label}
                      onChange={(event) => actualizarFila(fila.id, { label: event.target.value })}
                      placeholder={t.labelPlaceholder}
                    />
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {fila.tipo === 'input' ? (
                    <input
                      type="text"
                      value={fila.placeholder}
                      onChange={(event) => actualizarFila(fila.id, { placeholder: event.target.value })}
                      placeholder={t.inputPlaceholder}
                    />
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}