/*
  This codec's algorithm is based on Mikael Grev's MiGBase64 algorithm: http://migbase64.sourceforge.net
  which is licensed under the BSD Open Source license.
 */
import * as long from "long";

/**
 * Douglas Crockford's base-32 symbols, lowercased.
 * @see http://www.crockford.com/wrmg/base32.html
 */
export const SYMBOLS = "0123456789abcdefghjkmnpqrstvwxyz";
export const CHECK_EXTRAS = "*~$=u";

/*
 where does WORD_SIZE of 5 come from?
   • base-32 numbers have 32 digits in their alphabet
   • a byte is an 8-character word of base-2 numbers
   * a base-32 character needs 5 bits. That leaves 3 spare bits per byte.
   * Pack in another character (5 more bits) and you have 6 spare bits in the next byte, etc:

byte     11111111|22222222|33333333|44444444|55555555
base-32  11111222|22333334|44445555|56666677|77788888

   * 5 bytes needed to pack 8 base-32 numerals without gaps. That means a 5-byte word.
 */
export const PREFIX = "_";
export const CHECK_PRIME = 37;
export const WORD_SIZE = 5;
export const CHARS_PER_WORD = 8;
export const BYTE_MASK = 0xff;
export const BYTE_SHIFT = 8;
export const BYTE_SHIFT_START = WORD_SIZE * CHARS_PER_WORD - BYTE_SHIFT;
export const WORD_SHIFT = 5;
export const WORD_SHIFT_START = WORD_SIZE * CHARS_PER_WORD - WORD_SHIFT;
export const ZERO = long.fromInt(0, true);

export function toCharCode(char: string): number {
  return char.charCodeAt(0);
}