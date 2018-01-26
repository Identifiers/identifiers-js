/*
  This codec's algorithm is based on Mikael Grev's MiGBase64 algorithm: http://migbase64.sourceforge.net
  which is licensed under the BSD Open Source license.
 */
import * as long from "long";

export const SYMBOLS = "/0123456789?@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüý";

/*
 where does WORD_SIZE of 7 come from?
   • base-128 numbers need 128 letters in their alphabet
   • a byte is an 8-character word of base-2 numbers
   * a base-128 character needs 7 bits. That leaves a spare bit per byte.
   * Pack in another character (7 more bits) and you have two spare bits in the next byte, etc:

byte      11111111|22222222|33333333|44444444|55555555|66666666|77777777
base-128  11111112|22222233|33333444|44445555|55566666|66777777|78888888

   * 7 bytes needed to pack 8 base-128 numerals without gaps. That means a 7-byte word.
 */
export const WORD_SIZE = 7;
export const CHARS_PER_WORD = 8;
export const BYTE_SHIFT = 8;
export const BYTE_SHIFT_START = WORD_SIZE * CHARS_PER_WORD - BYTE_SHIFT;
export const WORD_SHIFT = 7;
export const WORD_SHIFT_START = WORD_SIZE * CHARS_PER_WORD - WORD_SHIFT;
export const TERMINATOR = "þ";
export const ZERO = long.fromInt(0, true);

export function toCharCode(char: string): number {
  return char.charCodeAt(0);
}