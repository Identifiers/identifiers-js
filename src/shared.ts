export const semanticTypeMask = 0x1f;

export const codecSymbol: symbol = Symbol.for("id-codec");

export function existsPredicate(value: any): boolean {
  return !!value || value !== null;
}
