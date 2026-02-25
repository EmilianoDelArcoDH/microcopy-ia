import type { ActivityConfig, ActivityState, LangCode } from '../types';
import { checklistCompletoReal, esTextoConContenido } from './common';

const texts: Record<
  LangCode,
  {
    pickOne: string;
    wrongOption: string;
    invalidOption: string;
    minRationale: (min: number) => string;
    weakRationale: string;
    needChecklist: string;
  }
> = {
  es: {
    pickOne: 'Debés elegir una opción antes de validar.',
    wrongOption: 'La opción elegida no coincide con la opción correcta definida para la actividad.',
    invalidOption: 'La opción elegida no pertenece a las opciones disponibles.',
    minRationale: (min) => `La justificación debe tener al menos ${min} caracteres.`,
    weakRationale: 'La justificación debe tener al menos 4 palabras y contenido concreto.',
    needChecklist: 'Debés completar todo el checklist humano antes de validar.',
  },
  en: {
    pickOne: 'You must choose an option before validating.',
    wrongOption: 'The selected option does not match the correct option for this activity.',
    invalidOption: 'The selected option is not part of the available options.',
    minRationale: (min) => `The rationale must have at least ${min} characters.`,
    weakRationale: 'The rationale must contain at least 4 words and concrete content.',
    needChecklist: 'You must complete the full human checklist before validating.',
  },
  pt: {
    pickOne: 'Você deve escolher uma opção antes de validar.',
    wrongOption: 'A opção escolhida não corresponde à opção correta da atividade.',
    invalidOption: 'A opção escolhida não faz parte das opções disponíveis.',
    minRationale: (min) => `A justificativa deve ter pelo menos ${min} caracteres.`,
    weakRationale: 'A justificativa deve conter pelo menos 4 palavras e conteúdo concreto.',
    needChecklist: 'Você deve completar todo o checklist humano antes de validar.',
  },
};

export function validateActividad02(config: ActivityConfig, state: ActivityState, lang: LangCode): string[] {
  const errores: string[] = [];
  const opcionCorrecta = String(config.inputsIniciales.opcionCorrecta ?? '');
  const opcionesPredefinidas = Array.isArray(config.inputsIniciales.opcionesPredefinidas)
    ? (config.inputsIniciales.opcionesPredefinidas as string[])
    : [];
  const opcionesDisponibles = state.opcionesIA.length ? state.opcionesIA : opcionesPredefinidas;
  const minimo = Number(config.inputsIniciales.minimoJustificacion ?? 20);
  const t = texts[lang];

  if (!state.opcionElegida) {
    errores.push(t.pickOne);
  } else if (!opcionesDisponibles.includes(state.opcionElegida)) {
    errores.push(t.invalidOption);
  } else if (state.opcionElegida !== opcionCorrecta) {
    errores.push(t.wrongOption);
  }

  if (state.justificacion.trim().length < minimo) {
    errores.push(t.minRationale(minimo));
  } else if (!esTextoConContenido(state.justificacion, minimo, 4)) {
    errores.push(t.weakRationale);
  }

  if (!checklistCompletoReal(state.checklistMarcado, config.checklistHumano)) {
    errores.push(t.needChecklist);
  }

  return errores;
}