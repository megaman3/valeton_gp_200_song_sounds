/**
 * Enkel, förutsägbar textmatchning för regelmotorn: gemener, utan accenter,
 * skiljetecken blir mellanslag och nyckelord måste matcha hela ord.
 */
export function normalizeText(s: string): string {
  return ` ${s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9+]+/g, ' ')
    .trim()} `;
}

/** Position för första träffen av något nyckelord, eller -1. */
export function findKeyword(normalizedText: string, keywords: string[]): { index: number; length: number } {
  let best = { index: -1, length: 0 };
  for (const kw of keywords) {
    const n = normalizeText(kw);
    if (n.trim() === '') continue;
    const i = normalizedText.indexOf(n);
    if (i === -1) continue;
    if (best.index === -1 || i < best.index || (i === best.index && n.length > best.length)) {
      best = { index: i, length: n.length };
    }
  }
  return best;
}

export function containsKeyword(text: string, keywords: string[]): boolean {
  return findKeyword(normalizeText(text), keywords).index !== -1;
}
