import type { ActivityConfig, ActivityState, LangCode } from '../types';
import { contarPalabras, normalizarTexto } from './common';

const palabrasGenericas = ['click', 'aquí', 'aca', 'más', 'ver', 'enviar'];
const regexAccion = /(revisá|revisa|completá|completa|intentá|intenta)/i;
const regexPaso = /(error|falló|fallo|no se pudo|faltan|inválid|invalido|inválido)/i;

const textosTipo: Record<LangCode, Record<'boton' | 'link' | 'error' | 'input', string>> = {
  es: { boton: 'botón', link: 'link', error: 'error', input: 'input' },
  en: { boton: 'button', link: 'link', error: 'error', input: 'input' },
  pt: { boton: 'botão', link: 'link', error: 'erro', input: 'input' },
};

const texts: Record<
  LangCode,
  {
    genericWord: (tipo: string, palabra: string) => string;
    missingButton: string;
    buttonWords: string;
    missingLink: string;
    linkWords: string;
    missingError: string;
    explainWhat: string;
    explainAction: string;
    missingInputRow: string;
    missingLabel: string;
    placeholderPrefix: string;
  }
> = {
  es: {
    genericWord: (tipo, palabra) => `La propuesta de ${tipo} contiene texto genérico no permitido: "${palabra}".`,
    missingButton: 'Falta completar la propuesta del botón.',
    buttonWords: 'La propuesta del botón debe tener entre 2 y 5 palabras.',
    missingLink: 'Falta completar la propuesta del link.',
    linkWords: 'La propuesta del link debe describir el destino con al menos 3 palabras.',
    missingError: 'Falta completar la propuesta del mensaje de error.',
    explainWhat: 'El mensaje de error debe explicar qué pasó.',
    explainAction: 'El mensaje de error debe indicar qué hacer (por ejemplo: revisá, completá o intentá).',
    missingInputRow: 'Falta la fila de propuesta para el input.',
    missingLabel: 'La propuesta del input debe incluir un label.',
    placeholderPrefix: 'El placeholder del input debe comenzar con "Ej:".',
  },
  en: {
    genericWord: (tipo, palabra) => `The ${tipo} proposal contains forbidden generic text: "${palabra}".`,
    missingButton: 'The button proposal is missing.',
    buttonWords: 'The button proposal must contain between 2 and 5 words.',
    missingLink: 'The link proposal is missing.',
    linkWords: 'The link proposal must describe the destination with at least 3 words.',
    missingError: 'The error-message proposal is missing.',
    explainWhat: 'The error message must explain what happened.',
    explainAction: 'The error message must tell what to do next (for example: revisá, completá or intentá).',
    missingInputRow: 'The input proposal row is missing.',
    missingLabel: 'The input proposal must include a label.',
    placeholderPrefix: 'The input placeholder must start with "Ej:".',
  },
  pt: {
    genericWord: (tipo, palabra) => `A proposta de ${tipo} contém texto genérico não permitido: "${palabra}".`,
    missingButton: 'Falta completar a proposta do botão.',
    buttonWords: 'A proposta do botão deve ter entre 2 e 5 palavras.',
    missingLink: 'Falta completar a proposta do link.',
    linkWords: 'A proposta do link deve descrever o destino com pelo menos 3 palavras.',
    missingError: 'Falta completar a proposta da mensagem de erro.',
    explainWhat: 'A mensagem de erro deve explicar o que aconteceu.',
    explainAction: 'A mensagem de erro deve indicar o que fazer (por exemplo: revisá, completá ou intentá).',
    missingInputRow: 'Falta a linha de proposta para o input.',
    missingLabel: 'A proposta do input deve incluir um label.',
    placeholderPrefix: 'O placeholder do input deve começar com "Ej:".',
  },
};

function contienePalabraGenerica(texto: string): string | null {
  const normalizado = normalizarTexto(texto);
  const encontrada = palabrasGenericas.find((palabra) => normalizado.includes(palabra));
  return encontrada ?? null;
}

export function validateAuditoriaActividad03(_config: ActivityConfig, state: ActivityState, lang: LangCode): string[] {
  const errores: string[] = [];
  const t = texts[lang];
  const tipos = textosTipo[lang];

  const filaBoton = state.tablaAuditoria.find((fila) => fila.tipo === 'boton');
  const filaLink = state.tablaAuditoria.find((fila) => fila.tipo === 'link');
  const filaError = state.tablaAuditoria.find((fila) => fila.tipo === 'error');
  const filaInput = state.tablaAuditoria.find((fila) => fila.tipo === 'input');

  state.tablaAuditoria.forEach((fila) => {
    const badWord = contienePalabraGenerica(fila.propuesta);
    if (badWord) {
      errores.push(t.genericWord(tipos[fila.tipo], badWord));
    }
  });

  if (!filaBoton || !filaBoton.propuesta.trim()) {
    errores.push(t.missingButton);
  } else {
    const words = contarPalabras(filaBoton.propuesta);
    if (words < 2 || words > 5) {
      errores.push(t.buttonWords);
    }
  }

  if (!filaLink || !filaLink.propuesta.trim()) {
    errores.push(t.missingLink);
  } else if (contarPalabras(filaLink.propuesta) < 3) {
    errores.push(t.linkWords);
  }

  if (!filaError || !filaError.propuesta.trim()) {
    errores.push(t.missingError);
  } else {
    if (!regexPaso.test(filaError.propuesta)) {
      errores.push(t.explainWhat);
    }
    if (!regexAccion.test(filaError.propuesta)) {
      errores.push(t.explainAction);
    }
  }

  if (!filaInput) {
    errores.push(t.missingInputRow);
  } else {
    if (!filaInput.label.trim()) {
      errores.push(t.missingLabel);
    }
    if (!filaInput.placeholder.trim().startsWith('Ej:')) {
      errores.push(t.placeholderPrefix);
    }
  }

  return errores;
}