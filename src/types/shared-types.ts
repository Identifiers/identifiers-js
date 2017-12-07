export const asIsCodec = {
  forIdentifier: (value) => value,
  encode: (value) => value,
  decode: (value) => value
}

export const SEMANTIC_TYPE_MASK = 0x1f;

/**
 * Semantic type slots to OR into type values.
 */
export const SEMANTIC_MASKS = {
  SLOT_1: 0X20,
  SLOT_2: 0X40,
  SLOT_3: 0X60,
  SLOT_4: 0X80,
  SLOT_5: 0Xa0,
  SLOT_6: 0Xc0,
};

/**
 * Extension flag indicates a second byte in the type declaration. OR this flag into the extended type value
 * to signal the extended state.
 */
export const EXT_MASK = 0xe0;
