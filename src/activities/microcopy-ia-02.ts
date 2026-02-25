import type { ActivityConfig, LangCode } from '../core/types';
import type { ActivityLocalizedData } from './microcopy-ia-01';

export const activityMicrocopyIA02: ActivityConfig = {
  id: 'microcopy-ia-02',
  titulo: 'Actividad 02 — Elegí la mejor opción',
  objetivo: 'Evaluar opciones de microcopy y justificar la decisión elegida.',
  supportsAI: false,
  inputsIniciales: {
    opcionesPredefinidas: [
      'Descargar reporte mensual',
      'Hacé click acá para bajar',
      'Descarga ya',
    ],
    opcionCorrecta: 'Descargar reporte mensual',
    minimoJustificacion: 20,
  },
  ui: {
    blocks: ['OptionsPicker', 'RationaleInput', 'Checklist', 'ValidationResults'],
  },
  reglasValidacion: [
    'La opción elegida debe coincidir con la opción correcta de la actividad.',
    'La justificación debe tener al menos 20 caracteres.',
  ],
  checklistHumano: [
    'La opción prioriza claridad.',
    'Evita lenguaje ambiguo o genérico.',
    'Respeta un tono consistente.',
    'Mantiene foco en la acción real.',
    'No sobrecarga con palabras innecesarias.',
  ],
};

export const activityMicrocopyIA02Localized: Record<LangCode, ActivityLocalizedData> = {
  es: {
    titulo: 'Actividad 02 — Elegí la mejor opción',
    objetivo: 'Evaluar opciones de microcopy y justificar la decisión elegida.',
    reglasValidacion: [
      'La opción elegida debe coincidir con la opción correcta de la actividad.',
      'La justificación debe tener al menos 20 caracteres.',
    ],
    checklistHumano: [
      'La opción prioriza claridad.',
      'Evita lenguaje ambiguo o genérico.',
      'Respeta un tono consistente.',
      'Mantiene foco en la acción real.',
      'No sobrecarga con palabras innecesarias.',
    ],
    inputsIniciales: {
      opcionesPredefinidas: ['Descargar reporte mensual', 'Hacé click acá para bajar', 'Descarga ya'],
      opcionCorrecta: 'Descargar reporte mensual',
    },
  },
  en: {
    titulo: 'Activity 02 — Choose the best option',
    objetivo: 'Evaluate microcopy alternatives and justify the selected decision.',
    reglasValidacion: [
      'The selected option must match the activity correct option.',
      'The rationale must be at least 20 characters long.',
    ],
    checklistHumano: [
      'The option prioritizes clarity.',
      'It avoids ambiguous or generic language.',
      'It keeps a consistent tone.',
      'It stays focused on the real action.',
      'It avoids unnecessary wording.',
    ],
    inputsIniciales: {
      opcionesPredefinidas: ['Download monthly report', 'Click here to download', 'Download now'],
      opcionCorrecta: 'Download monthly report',
    },
  },
  pt: {
    titulo: 'Atividade 02 — Escolha a melhor opção',
    objetivo: 'Avaliar opções de microcopy e justificar a decisão escolhida.',
    reglasValidacion: [
      'A opção escolhida deve coincidir com a opção correta da atividade.',
      'A justificativa deve ter pelo menos 20 caracteres.',
    ],
    checklistHumano: [
      'A opção prioriza clareza.',
      'Evita linguagem ambígua ou genérica.',
      'Mantém tom consistente.',
      'Mantém foco na ação real.',
      'Evita palavras desnecessárias.',
    ],
    inputsIniciales: {
      opcionesPredefinidas: ['Baixar relatório mensal', 'Clique aqui para baixar', 'Baixe agora'],
      opcionCorrecta: 'Baixar relatório mensal',
    },
  },
};