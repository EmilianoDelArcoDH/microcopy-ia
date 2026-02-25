import type { ActivityConfig, ActivityState, LangCode } from '../types';

const texts: Record<LangCode, { pickOne: string; wrongOption: string; minRationale: (min: number) => string }> = {
  es: {
    pickOne: 'Debés elegir una opción antes de validar.',
    wrongOption: 'La opción elegida no coincide con la opción correcta definida para la actividad.',
    minRationale: (min) => `La justificación debe tener al menos ${min} caracteres.`,
  },
  en: {
    pickOne: 'You must choose an option before validating.',
    wrongOption: 'The selected option does not match the correct option for this activity.',
    minRationale: (min) => `The rationale must have at least ${min} characters.`,
  },
  pt: {
    pickOne: 'Você deve escolher uma opção antes de validar.',
    wrongOption: 'A opção escolhida não corresponde à opção correta da atividade.',
    minRationale: (min) => `A justificativa deve ter pelo menos ${min} caracteres.`,
  },
};

export function validateActividad02(config: ActivityConfig, state: ActivityState, lang: LangCode): string[] {
  const errores: string[] = [];
  const opcionCorrecta = String(config.inputsIniciales.opcionCorrecta ?? '');
  const minimo = Number(config.inputsIniciales.minimoJustificacion ?? 20);
  const t = texts[lang];

  if (!state.opcionElegida) {
    errores.push(t.pickOne);
  } else if (state.opcionElegida !== opcionCorrecta) {
    errores.push(t.wrongOption);
  }

  if (state.justificacion.trim().length < minimo) {
    errores.push(t.minRationale(minimo));
  }

  return errores;
}