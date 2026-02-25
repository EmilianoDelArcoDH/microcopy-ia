import type { BlockProps } from '../../core/types';

const texts = {
    es: {
        title: 'Paso 3 · Elegí una opción',
        empty: 'Todavía no hay opciones para elegir.',
    },
    en: {
        title: 'Step 3 · Choose an option',
        empty: 'There are no options to choose yet.',
    },
    pt: {
        title: 'Passo 3 · Escolha uma opção',
        empty: 'Ainda não há opções para escolher.',
    },
} as const;

export function OptionsPicker({ config, state, setState, lang }: BlockProps): JSX.Element {
    const t = texts[lang];
    const opcionesPredefinidas = Array.isArray(config.inputsIniciales.opcionesPredefinidas)
        ? (config.inputsIniciales.opcionesPredefinidas as string[])
        : [];

    const opciones = state.opcionesIA.length ? state.opcionesIA : opcionesPredefinidas;

    return (
        <section>
            <h3>{t.title}</h3>
            {opciones.length === 0 ? (
                <p className="alert">{t.empty}</p>
            ) : (
                <div className="options-list">
                    {opciones.map((opcion) => (
                        <label key={opcion} className="option-item">
                            <input
                                type="radio"
                                name="opcionMicrocopy"
                                checked={state.opcionElegida === opcion}
                                onChange={() =>
                                    setState((prev) => ({
                                        ...prev,
                                        opcionElegida: opcion,
                                    }))
                                }
                            />
                            <span>{opcion}</span>
                        </label>
                    ))}
                </div>
            )}
        </section>
    );
}