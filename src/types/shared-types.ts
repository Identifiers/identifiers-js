
export const asIsCodec = {
  forIdentifier: (value) => value,
  encode: (value) => value,
  decode: (value) => value
}

export const SEMANTIC_SLOTS = [0x20, 0x40, 0x60, 0x80, 0xa0, 0xc0];
// todo fill out more slots with EXT added in
export const EXT = 0xe0;
