import type { ActivityConfig, ActivityState, LangCode } from '../types';
import { incluyeFrase } from './common';

const texts: Record<
  LangCode,
  {
    missingTextOriginal: string;
    missingContext: string;
    missingMax: string;
    missingNeutral: string;
    missingThree: string;
    needPromptStage1: string;
    needThreeOptions: string;
    needChoice: string;
    needChecklist: string;
    needRationale: string;
  }
> = {
  es: {
    missingTextOriginal: 'El prompt debe incluir la frase "Texto original".',
    missingContext: 'El prompt debe incluir la frase "Contexto".',
    missingMax: 'El prompt debe incluir la palabra "máximo" para limitar longitud.',
    missingNeutral: 'El prompt debe pedir explícitamente "español neutro".',
    missingThree: 'El prompt debe pedir "exactamente 3 opciones" o "Dame 3 opciones".',
    needPromptStage1: 'Primero validá la estructura del prompt (Etapa 1).',
    needThreeOptions: 'Primero generá las 3 opciones con IA (Etapa 2).',
    needChoice: 'Debés elegir una opción final.',
    needChecklist: 'Debés marcar los 5 checks del checklist humano.',
    needRationale: 'La justificación final debe tener al menos 30 caracteres.',
  },
  en: {
    missingTextOriginal: 'The prompt must include the phrase "Texto original".',
    missingContext: 'The prompt must include the phrase "Contexto".',
    missingMax: 'The prompt must include the word "máximo" to limit length.',
    missingNeutral: 'The prompt must explicitly request "español neutro".',
    missingThree: 'The prompt must request "exactamente 3 opciones" or "Dame 3 opciones".',
    needPromptStage1: 'First validate prompt structure (Stage 1).',
    needThreeOptions: 'First generate 3 options with AI (Stage 2).',
    needChoice: 'You must choose a final option.',
    needChecklist: 'You must mark all 5 checks in the human checklist.',
    needRationale: 'Final rationale must have at least 30 characters.',
  },
  pt: {
    missingTextOriginal: 'O prompt deve incluir a frase "Texto original".',
    missingContext: 'O prompt deve incluir a frase "Contexto".',
    missingMax: 'O prompt deve incluir a palavra "máximo" para limitar o tamanho.',
    missingNeutral: 'O prompt deve pedir explicitamente "español neutro".',
    missingThree: 'O prompt deve pedir "exactamente 3 opciones" ou "Dame 3 opciones".',
    needPromptStage1: 'Primeiro valide a estrutura do prompt (Etapa 1).',
    needThreeOptions: 'Primeiro gere 3 opções com IA (Etapa 2).',
    needChoice: 'Você deve escolher uma opção final.',
    needChecklist: 'Você deve marcar os 5 checks do checklist humano.',
    needRationale: 'A justificativa final deve ter pelo menos 30 caracteres.',
  },
};

export function validarEstructuraPrompt(prompt: string, lang: LangCode): string[] {
  const errores: string[] = [];
  const t = texts[lang];

  if (!incluyeFrase(prompt, 'Texto original')) {
    errores.push(t.missingTextOriginal);
  }
  if (!incluyeFrase(prompt, 'Contexto')) {
    errores.push(t.missingContext);
  }
  if (!incluyeFrase(prompt, 'máximo')) {
    errores.push(t.missingMax);
  }
  if (!incluyeFrase(prompt, 'español neutro')) {
    errores.push(t.missingNeutral);
  }
  if (!incluyeFrase(prompt, 'exactamente 3 opciones') && !incluyeFrase(prompt, 'Dame 3 opciones')) {
    errores.push(t.missingThree);
  }

  return errores;
}

export function validatePromptActividad01(config: ActivityConfig, state: ActivityState, lang: LangCode): string[] {
  const errores: string[] = [];
  const t = texts[lang];

  if (!state.promptEstructuraOK) {
    errores.push(t.needPromptStage1);
  }

  if (state.opcionesIA.length !== 3) {
    errores.push(t.needThreeOptions);
  }

  if (!state.opcionElegida.trim()) {
    errores.push(t.needChoice);
  }

  if (state.checklistMarcado.length < config.checklistHumano.length) {
    errores.push(t.needChecklist);
  }

  if (state.justificacion.trim().length < 30) {
    errores.push(t.needRationale);
  }

  return errores;
}