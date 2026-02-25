import type { ActivityConfig, ActivityState, LangCode } from '../types';
import { checklistCompletoReal, esTextoConContenido, incluyeFrase, normalizarTexto, opcionesNoVaciasUnicas } from './common';

const texts: Record<
  LangCode,
  {
    missingTextOriginal: string;
    missingContext: string;
    missingMax: string;
    missingNeutral: string;
    missingThree: string;
    missingPromptMin: string;
    missingPromptBlocks: string;
    missingPromptNumbers: string;
    invalidChosenOption: string;
    weakRationale: string;
    vagueRationale: string;
    rationaleNeedsAnchor: string;
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
    missingPromptMin: 'El prompt debe tener al menos 80 caracteres y 12 palabras.',
    missingPromptBlocks: 'El prompt debe incluir secciones con contenido: "Texto original:" y "Contexto:".',
    missingPromptNumbers: 'El prompt debe definir un límite con número (ejemplo: "máximo 5 palabras").',
    invalidChosenOption: 'La opción elegida debe coincidir con una de las 3 opciones generadas.',
    weakRationale: 'La justificación final debe tener al menos 6 palabras y contenido concreto.',
    vagueRationale: 'La justificación es demasiado genérica. Evitá frases como "me pareció bien" sin evidencia.',
    rationaleNeedsAnchor: 'La justificación debe mencionar al menos un criterio concreto (claridad, acción, brevedad, tono, promesas) o palabras de la opción elegida.',
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
    missingPromptMin: 'The prompt must have at least 80 characters and 12 words.',
    missingPromptBlocks: 'The prompt must include non-empty sections: "Texto original:" and "Contexto:".',
    missingPromptNumbers: 'The prompt must define a numeric limit (example: "máximo 5 palabras").',
    invalidChosenOption: 'The selected option must match one of the 3 generated options.',
    weakRationale: 'Final rationale must have at least 6 words and concrete content.',
    vagueRationale: 'The rationale is too generic. Avoid statements like "it seemed fine" without evidence.',
    rationaleNeedsAnchor: 'The rationale must reference at least one concrete criterion (clarity, action, brevity, tone, promises) or words from the selected option.',
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
    missingPromptMin: 'O prompt deve ter pelo menos 80 caracteres e 12 palavras.',
    missingPromptBlocks: 'O prompt deve incluir seções com conteúdo: "Texto original:" e "Contexto:".',
    missingPromptNumbers: 'O prompt deve definir um limite numérico (exemplo: "máximo 5 palabras").',
    invalidChosenOption: 'A opção escolhida deve coincidir com uma das 3 opções geradas.',
    weakRationale: 'A justificativa final deve ter pelo menos 6 palavras e conteúdo concreto.',
    vagueRationale: 'A justificativa está genérica demais. Evite frases como "me pareceu bom" sem evidência.',
    rationaleNeedsAnchor: 'A justificativa deve mencionar ao menos um critério concreto (clareza, ação, brevidade, tom, promessas) ou palavras da opção escolhida.',
    needPromptStage1: 'Primeiro valide a estrutura do prompt (Etapa 1).',
    needThreeOptions: 'Primeiro gere 3 opções com IA (Etapa 2).',
    needChoice: 'Você deve escolher uma opção final.',
    needChecklist: 'Você deve marcar os 5 checks do checklist humano.',
    needRationale: 'A justificativa final deve ter pelo menos 30 caracteres.',
  },
};

const vaguePatterns: Record<LangCode, RegExp[]> = {
  es: [
    /me\s+pareci[oó]\s+que\s+estaba\s+bien/i,
    /me\s+parece\s+bien/i,
    /est[aá]\s+bien\s+as[ií]/i,
    /no\s+veo\s+que\s+haya\s+quedado\s+corto/i,
  ],
  en: [/it\s+seemed\s+fine/i, /looks?\s+good\s+to\s+me/i, /it\s+is\s+okay\s+as\s+is/i],
  pt: [/me\s+pareceu\s+bom/i, /est[aá]\s+bom\s+assim/i, /acho\s+que\s+est[aá]\s+bom/i],
};

const stopWords = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'y', 'o', 'u', 'a', 'en', 'por', 'para',
  'que', 'se', 'es', 'al', 'lo', 'le', 'con', 'sin', 'the', 'and', 'for', 'with', 'from', 'this', 'that', 'is',
  'to', 'of', 'as', 'it', 'or', 'at', 'um', 'uma', 'de', 'do', 'da', 'dos', 'das', 'e', 'ou', 'com', 'sem', 'no',
  'na', 'nos', 'nas', 'que', 'por', 'para', 'é', 'ao', 'aos', 'às', 'os', 'as',
]);

function extraerTokensRelevantes(texto: string): string[] {
  return normalizarTexto(texto)
    .split(/[^a-záéíóúüñãõâêîôûàèìòùç0-9]+/i)
    .filter((token) => token.length >= 4 && !stopWords.has(token));
}

function justificacionEsVaga(justificacion: string, lang: LangCode): boolean {
  const normalized = justificacion.trim();
  return vaguePatterns[lang].some((pattern) => pattern.test(normalized));
}

function tieneAnclaConcreta(justificacion: string, opcionElegida: string, checklistHumano: string[]): boolean {
  const normalized = normalizarTexto(justificacion);
  const keywords = new Set<string>([
    ...extraerTokensRelevantes(opcionElegida),
    ...checklistHumano.flatMap((item) => extraerTokensRelevantes(item)),
    'claridad',
    'accion',
    'acción',
    'breve',
    'tono',
    'promesa',
    'contexto',
    'clarity',
    'action',
    'brief',
    'tone',
    'promise',
    'context',
    'clareza',
    'ação',
    'acao',
    'brevidade',
    'tom',
    'promessa',
  ]);

  return Array.from(keywords).some((keyword) => keyword.length >= 4 && normalized.includes(keyword));
}

export function validarEstructuraPrompt(prompt: string, lang: LangCode): string[] {
  const errores: string[] = [];
  const t = texts[lang];
  const promptNormalizado = prompt.trim();

  if (!esTextoConContenido(promptNormalizado, 80, 12)) {
    errores.push(t.missingPromptMin);
  }

  const tieneTextoOriginalConValor = /texto original\s*:\s*\S+/i.test(promptNormalizado);
  const tieneContextoConValor = /contexto\s*:\s*\S+/i.test(promptNormalizado);
  if (!tieneTextoOriginalConValor || !tieneContextoConValor) {
    errores.push(t.missingPromptBlocks);
  }

  if (!/(máximo|maximo|límite|limite).{0,20}\d+/i.test(promptNormalizado)) {
    errores.push(t.missingPromptNumbers);
  }

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
  const opcionesLimpias = state.opcionesIA.map((opcion) => opcion.trim()).filter(Boolean);

  if (!state.promptEstructuraOK) {
    errores.push(t.needPromptStage1);
  }

  if (!opcionesNoVaciasUnicas(state.opcionesIA, 3)) {
    errores.push(t.needThreeOptions);
  }

  if (!state.opcionElegida.trim()) {
    errores.push(t.needChoice);
  } else if (!opcionesLimpias.includes(state.opcionElegida.trim())) {
    errores.push(t.invalidChosenOption);
  }

  if (!checklistCompletoReal(state.checklistMarcado, config.checklistHumano)) {
    errores.push(t.needChecklist);
  }

  if (state.justificacion.trim().length < 30) {
    errores.push(t.needRationale);
  } else if (!esTextoConContenido(state.justificacion, 30, 6)) {
    errores.push(t.weakRationale);
  } else {
    if (justificacionEsVaga(state.justificacion, lang)) {
      errores.push(t.vagueRationale);
    }
    if (!tieneAnclaConcreta(state.justificacion, state.opcionElegida, config.checklistHumano)) {
      errores.push(t.rationaleNeedsAnchor);
    }
  }

  return errores;
}