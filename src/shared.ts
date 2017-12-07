/**
 * Symbol key to store codec in an identifier instance.
 */
export const codecSymbol: symbol = Symbol.for("id-codec");

/**
 * Common predicate used to test if a value exists--neither undefined or null.
 * @param value the value to test
 * @returns true if the value exists, regardless of it's actual value
 */
export function existsPredicate(value: any): boolean {
  return !!value || value != null;
}
