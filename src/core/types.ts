import type React from 'react';

export type LangCode = 'es' | 'en' | 'pt';

export type Variant = 'src' | 'solution';

export type ActivityId = 'microcopy-ia-01' | 'microcopy-ia-02' | 'microcopy-ia-03';

export type ActivityBlockId =
  | 'PromptBuilder'
  | 'GroqGenerate'
  | 'OptionsPicker'
  | 'RationaleInput'
  | 'Checklist'
  | 'ValidationResults'
  | 'BrokenUISample'
  | 'AuditTable';

export type AuditRowType = 'boton' | 'link' | 'error' | 'input';

export interface AuditRow {
  id: string;
  tipo: AuditRowType;
  original: string;
  propuesta: string;
  label: string;
  placeholder: string;
}

export interface ValidationResult {
  ok: boolean;
  errores: string[];
  fechaIso: string;
}

export interface ActivityState {
  promptUsuario: string;
  promptAlumno: string;
  erroresPrompt: string[];
  promptEstructuraOK: boolean;
  opcionesIA: string[];
  opcionElegida: string;
  justificacion: string;
  tablaAuditoria: AuditRow[];
  checklistMarcado: string[];
  resultadosValidacion: ValidationResult | null;
}

export interface ActivityConfig {
  id: ActivityId;
  titulo: string;
  objetivo: string;
  supportsAI: boolean;
  inputsIniciales: Record<string, unknown>;
  ui: {
    blocks: ActivityBlockId[];
  };
  reglasValidacion: string[];
  checklistHumano: string[];
}

export interface QueryState {
  a: ActivityId;
  lang: LangCode;
  variant: Variant;
}

export interface BlockProps {
  config: ActivityConfig;
  state: ActivityState;
  setState: React.Dispatch<React.SetStateAction<ActivityState>>;
  lang: LangCode;
  variant: Variant;
}