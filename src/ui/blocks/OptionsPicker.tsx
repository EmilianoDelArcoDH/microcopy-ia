import type { BlockProps } from '../../core/types';

const texts = {
    es: {
        title: 'Paso 3 · Elegí una opción',
        subtitle: 'Leé las alternativas y seleccioná tu opción final.',
        empty: 'Todavía no hay opciones para elegir.',
        selected: 'Opción elegida',
        pending: 'Aún no elegiste una opción.',
        optionLabel: 'Opción',
    },
    en: {
        title: 'Step 3 · Choose an option',
        subtitle: 'Read the alternatives and select your final option.',
        empty: 'There are no options to choose yet.',
        selected: 'Selected option',
        pending: 'You have not selected an option yet.',
        optionLabel: 'Option',
    },
    pt: {
        title: 'Passo 3 · Escolha uma opção',
        subtitle: 'Leia as alternativas e selecione sua opção final.',
        empty: 'Ainda não há opções para escolher.',
        selected: 'Opção selecionada',
        pending: 'Você ainda não selecionou uma opção.',
        optionLabel: 'Opção',
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
            <p className="muted">{t.subtitle}</p>
            {opciones.length === 0 ? (
                <p className="alert">{t.empty}</p>
            ) : (
                <>
                    <div className="options-list">
                    {opciones.map((opcion, index) => (
                        <label
                            key={opcion}
                            className={`option-item ${state.opcionElegida === opcion ? 'option-item-selected' : ''}`}
                        >
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
                            <div className="option-copy">
                                <span className="option-kicker">{t.optionLabel} {index + 1}</span>
                                <span>{opcion}</span>
                            </div>
                        </label>
                    ))}
                    </div>
                    <p className={`option-selected ${state.opcionElegida ? 'option-selected-ok' : ''}`}>
                        <strong>{t.selected}:</strong> {state.opcionElegida || t.pending}
                    </p>
                </>
            )}
        </section>
    );
}