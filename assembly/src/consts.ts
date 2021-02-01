export const SYMBOLS = "0123456789abcdefghjkmnpqrstvwxyz";
export const CHECK_EXTRAS = "*~$=u";
export const CHECK_PRIME = SYMBOLS.length + CHECK_EXTRAS.length;
export const BYTE_SIZE = 0x8;
export const WORD_SIZE = 0x5;
const CHARS_PER_WORD = 0x8;

export const BYTE_SHIFT_START = WORD_SIZE * CHARS_PER_WORD - BYTE_SIZE;
export const WORD_SHIFT_START = WORD_SIZE * CHARS_PER_WORD - WORD_SIZE;