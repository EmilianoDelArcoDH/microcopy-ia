import type { ActivityConfig, ActivityState, LangCode, ValidationResult } from '../types';
import { validatePromptActividad01 } from './activity01';
import { validateActividad02 } from './activity02';
import { validateAuditoriaActividad03 } from './activity03';

export function validarActividad(config: ActivityConfig, state: ActivityState, lang: LangCode): ValidationResult {
  let errores: string[] = [];

  if (config.id === 'microcopy-ia-01') {
    errores = validatePromptActividad01(config, state, lang);
  }
  if (config.id === 'microcopy-ia-02') {
    errores = validateActividad02(config, state, lang);
  }
  if (config.id === 'microcopy-ia-03') {
    errores = validateAuditoriaActividad03(config, state, lang);
  }

  return {
    ok: errores.length === 0,
    errores,
    fechaIso: new Date().toISOString(),
  };
}