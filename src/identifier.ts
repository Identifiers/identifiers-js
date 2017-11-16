/**
 * Contains the value and type of an Identifier value.
 */
export interface Identifier<T> {
  /**
   * Short string name the type of the Identifier. Examples include 'uuid', 'date', 'u-id'.
   */
  readonly type: string;

  /**
   * The value of the Identifier.
   */
  readonly value: T;
}


/**
 * Codec that prepares an Identifier for encoding as well as creates an Identifier from a decoded object.
 */
export interface IdentifierCodec {

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
   * Validates a value before it is used in an Identifier. Throw an Error if the value is not of the expected shape.
   * @param value the value to validate
   */
  validateForIdentifier(value: any): void;

  /**
   * Convert a value into a value that can be used in an Identifier.
   * @param value the value to prepare
   * @returns the prepared value
   */
  forIdentifier(value: any): any;

  /**
   * Convert an Identifier's value into a value that can be encoded.
   * @param value the value to prepare
   * @returns the prepared value
   */
  encode(value: any): any;

  /**
   * Validates a value before it is decoded. Throw an Error if the value is not of the expected shape.
   * @param value the value to validate
   */
  validateForDecoding(value: any): void;

  /**
   * Converts a decoded value into an Identifier's value. This function should throw an Error if the decoded type is wrong.
   * @param the decoded value
   * @returns The identifier value
   */
  decode(decoded: any): any;
}