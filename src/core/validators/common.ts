export function normalizarTexto(value: string): string {
  return value.trim().toLowerCase();
}

export function contarPalabras(value: string): number {
  const partes = value.trim().split(/\s+/).filter(Boolean);
  return partes.length;
}

export function incluyeFrase(texto: string, fragmento: string): boolean {
  return normalizarTexto(texto).includes(normalizarTexto(fragmento));
}