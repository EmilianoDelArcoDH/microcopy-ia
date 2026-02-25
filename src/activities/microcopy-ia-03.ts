import type { ActivityConfig, AuditRow, LangCode } from '../core/types';
import type { ActivityLocalizedData } from './microcopy-ia-01';

const filasIniciales: AuditRow[] = [
  {
    id: 'fila-boton',
    tipo: 'boton',
    original: 'Click acá',
    propuesta: '',
    label: '',
    placeholder: '',
  },
  {
    id: 'fila-link',
    tipo: 'link',
    original: 'Ver más',
    propuesta: '',
    label: '',
    placeholder: '',
  },
  {
    id: 'fila-error',
    tipo: 'error',
    original: 'Error 502: bad gateway',
    propuesta: '',
    label: '',
    placeholder: '',
  },
  {
    id: 'fila-input',
    tipo: 'input',
    original: 'placeholder="Tu dato" (sin label)',
    propuesta: '',
    label: '',
    placeholder: '',
  },
];

export const activityMicrocopyIA03: ActivityConfig = {
  id: 'microcopy-ia-03',
  titulo: 'Actividad 03 — Auditoría de microcopy roto',
  objetivo: 'Detectar microcopy problemático y proponer mejoras concretas y accionables.',
  supportsAI: false,
  inputsIniciales: {
    filasAuditoria: filasIniciales,
  },
  ui: {
    blocks: ['BrokenUISample', 'AuditTable', 'Checklist', 'ValidationResults'],
  },
  reglasValidacion: [
    'Evitar palabras genéricas prohibidas.',
    'Botón entre 2 y 5 palabras.',
    'Link con destino explícito (mínimo 3 palabras).',
    'Error: indicar qué pasó y qué hacer (con verbo de acción).',
    'Input: incluir label y placeholder que empiece con "Ej:".',
  ],
  checklistHumano: [
    'Cada texto aporta contexto suficiente.',
    'Los mensajes guían la siguiente acción.',
    'Se evita jerga técnica innecesaria.',
    'La longitud es razonable para UI.',
    'Las propuestas mantienen consistencia de tono.',
  ],
};

export const activityMicrocopyIA03Localized: Record<LangCode, ActivityLocalizedData> = {
  es: {
    titulo: 'Actividad 03 — Auditoría de microcopy roto',
    objetivo: 'Detectar microcopy problemático y proponer mejoras concretas y accionables.',
    reglasValidacion: [
      'Evitar palabras genéricas prohibidas.',
      'Botón entre 2 y 5 palabras.',
      'Link con destino explícito (mínimo 3 palabras).',
      'Error: indicar qué pasó y qué hacer (con verbo de acción).',
      'Input: incluir label y placeholder que empiece con "Ej:".',
    ],
    checklistHumano: [
      'Cada texto aporta contexto suficiente.',
      'Los mensajes guían la siguiente acción.',
      'Se evita jerga técnica innecesaria.',
      'La longitud es razonable para UI.',
      'Las propuestas mantienen consistencia de tono.',
    ],
    inputsIniciales: {
      filasAuditoria: [
        { id: 'fila-boton', tipo: 'boton', original: 'Click acá', propuesta: '', label: '', placeholder: '' },
        { id: 'fila-link', tipo: 'link', original: 'Ver más', propuesta: '', label: '', placeholder: '' },
        { id: 'fila-error', tipo: 'error', original: 'Error 502: bad gateway', propuesta: '', label: '', placeholder: '' },
        { id: 'fila-input', tipo: 'input', original: 'placeholder="Tu dato" (sin label)', propuesta: '', label: '', placeholder: '' },
      ],
    },
  },
  en: {
    titulo: 'Activity 03 — Broken microcopy audit',
    objetivo: 'Identify problematic microcopy and propose concrete, actionable improvements.',
    reglasValidacion: [
      'Avoid forbidden generic words.',
      'Button text must have 2 to 5 words.',
      'Link text must describe destination (minimum 3 words).',
      'Error text must explain what happened and what to do next.',
      'Input proposal must include label and placeholder starting with "Ej:".',
    ],
    checklistHumano: [
      'Each text provides enough context.',
      'Messages guide the next action.',
      'Unnecessary technical jargon is avoided.',
      'Length is reasonable for UI.',
      'Proposals keep tone consistency.',
    ],
    inputsIniciales: {
      filasAuditoria: [
        { id: 'fila-boton', tipo: 'boton', original: 'Click here', propuesta: '', label: '', placeholder: '' },
        { id: 'fila-link', tipo: 'link', original: 'See more', propuesta: '', label: '', placeholder: '' },
        { id: 'fila-error', tipo: 'error', original: 'Error 502: bad gateway', propuesta: '', label: '', placeholder: '' },
        { id: 'fila-input', tipo: 'input', original: 'placeholder="Your data" (no label)', propuesta: '', label: '', placeholder: '' },
      ],
    },
  },
  pt: {
    titulo: 'Atividade 03 — Auditoria de microcopy quebrado',
    objetivo: 'Detectar microcopy problemático e propor melhorias concretas e acionáveis.',
    reglasValidacion: [
      'Evitar palavras genéricas proibidas.',
      'Botão entre 2 e 5 palavras.',
      'Link com destino explícito (mínimo 3 palavras).',
      'Erro: indicar o que aconteceu e o que fazer (com verbo de ação).',
      'Input: incluir label e placeholder iniciando com "Ej:".',
    ],
    checklistHumano: [
      'Cada texto fornece contexto suficiente.',
      'As mensagens guiam a próxima ação.',
      'Evita jargão técnico desnecessário.',
      'O tamanho é razoável para UI.',
      'As propostas mantêm consistência de tom.',
    ],
    inputsIniciales: {
      filasAuditoria: [
        { id: 'fila-boton', tipo: 'boton', original: 'Clique aqui', propuesta: '', label: '', placeholder: '' },
        { id: 'fila-link', tipo: 'link', original: 'Ver mais', propuesta: '', label: '', placeholder: '' },
        { id: 'fila-error', tipo: 'error', original: 'Erro 502: bad gateway', propuesta: '', label: '', placeholder: '' },
        { id: 'fila-input', tipo: 'input', original: 'placeholder="Seu dado" (sem label)', propuesta: '', label: '', placeholder: '' },
      ],
    },
  },
};