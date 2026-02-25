export function normalizarTexto(value: string): string {
  return value.trim().toLowerCase();
}

export function compactarEspacios(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function contarPalabras(value: string): number {
  const partes = compactarEspacios(value).split(/\s+/).filter(Boolean);
  return partes.length;
}

export function incluyeFrase(texto: string, fragmento: string): boolean {
  return normalizarTexto(texto).includes(normalizarTexto(fragmento));
}

export function esTextoConContenido(value: string, minChars: number, minWords: number): boolean {
  const text = compactarEspacios(value);
  if (text.length < minChars) {
    return false;
  }

  if (contarPalabras(text) < minWords) {
    return false;
  }

  return /[a-záéíóúüñãõâêîôûàèìòùç]/i.test(text);
}

export function opcionesNoVaciasUnicas(opciones: string[], exactCount: number): boolean {
  if (opciones.length !== exactCount) {
    return false;
  }

  const limpias = opciones.map((opcion) => compactarEspacios(opcion)).filter(Boolean);
  if (limpias.length !== exactCount) {
    return false;
  }

  const unicas = new Set(limpias.map((opcion) => normalizarTexto(opcion)));
  return unicas.size === exactCount;
}

export function checklistCompletoReal(checklistMarcado: string[], checklistEsperado: string[]): boolean {
  const esperado = new Set(checklistEsperado.map((item) => normalizarTexto(item)));
  const marcado = new Set(checklistMarcado.map((item) => normalizarTexto(item)).filter((item) => esperado.has(item)));
  return esperado.size > 0 && marcado.size === esperado.size;
}