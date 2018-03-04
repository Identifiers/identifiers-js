/**
 * Contains the value and type of an Identifier value.
 */
import {Spec} from "js.spec";

export interface Identifier<VALUE> {
  /**
   * Short string name the type of the Identifier. Examples include 'uuid', 'date', 'geo'.
   */
  readonly type: string;

  /**
   * The value of the Identifier.
   */
  readonly value: VALUE;

  /**
   * Returns the identifier encoded as a base-128 string.
   */
  toString(): string;

  /**
   * Returns the identifier encoded in a base-32 format. This string is URI safe and case-insensitive.
   */
  toBase32String(): string;

  /**
   * Converts the identifier to a base-128 JSON string.
   */
  toJSON(key?: string): string;
}


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