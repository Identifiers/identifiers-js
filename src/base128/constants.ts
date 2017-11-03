import * as long from "long";

export const ALPHABET = "/0123456789?@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüý";
export const REGEXP = /[/-9?-Za-z¿-ý]{2,}þ/;
export const WORD_SIZE = 7;
export const CHARS_PER_WORD = 8;
export const BYTE_SHIFT = 8;
export const BYTE_SHIFT_START = WORD_SIZE * CHARS_PER_WORD - BYTE_SHIFT;
export const WORD_SHIFT = 7;
export const WORD_SHIFT_START = WORD_SIZE * CHARS_PER_WORD - WORD_SHIFT;
export const TERMINATOR = "þ";
export const ZERO = long.fromInt(0, true);