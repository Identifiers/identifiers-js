import {Spec} from "js.spec";

/**
 * Codec that prepares an Identifier for encoding as well as creates an Identifier from a decoded object.
 */
export interface IdentifierCodec<INPUT, VALUE = INPUT, ENCODED = VALUE> {

  /**
   * A code (< 128) marking the type of the identifier. Used to re-identify the Codec from an encoded string.
   * Codes from 0-7 are primitives. Codes 8-15 are structural. Semantic codes should be based on a primitive/structural
   * type by or-ing the base typeCode with 0x10:
   * <code>
   * newTypeCode = baseTypeCode | 0x10;
   * </code>
   */
  readonly typeCode: number;

  /**
   * Short string of the type of Identifier.
   */
  readonly type: string;

  /**
   * Spec to validate a value before it is used in an Identifier.
   */
  readonly specForIdentifier: Spec;

  /**
   * Spec to validate a value before it is decoded.
   */
  readonly specForDecoding: Spec;

  /**
   * Convert a value into a value that can be used in an Identifier.
   * @param input the input value to prepare
   * @returns the prepared value
   */
  forIdentifier(input: INPUT): VALUE;

  /**
   * Generate a debug string for the identifier value.
   * @param value the identifier's value
   * @returns a human-discernible debug string
   */
  toDebugString(value: VALUE): string;

  /**
   * Convert an Identifier's value into a value that can be encoded.
   * @param value the value to encode
   * @returns the encoded value
   */
  encode(value: VALUE): ENCODED;

  /**
   * Converts a encoded value into an Identifier's value. This function should throw an Error if the
   * decoded type is wrong.
   * @param encoded the encoded value
   * @returns The identifier value
   */
  decode(encoded: ENCODED): VALUE;
}