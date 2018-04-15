/**
 * Bit to indicate the type code is a semantic type code.
 */
export const SEMANTIC_TYPE_FLAG = 0x80;

/**
 * Mask to AND against a type code to find the non-semantic type code.
 */
export const SEMANTIC_TYPE_MASK = SEMANTIC_TYPE_FLAG - 1;

/**
 * Shift the slot position left by this value and OR it with the semantic type value.
 */
export const SEMANTIC_SLOT_SHIFT = 0x8;

const SLOTS: number[] = [];

export function calculateSemanticTypeCode(baseTypeCode: number, slot: number): number {
  if (SLOTS[slot]) {
    throw new Error(`semantic slot ${slot} already taken by ${SLOTS[slot]}.`);
  }
  return SLOTS[slot] = baseTypeCode | SEMANTIC_TYPE_FLAG | (slot << SEMANTIC_SLOT_SHIFT);
}