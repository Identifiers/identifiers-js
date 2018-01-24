/**
 * Contains the value and type of an Identifier value.
 */
import {Spec} from "js.spec";
import {encodeToString} from "./encode";

/*
The case of an Identifier class:
  1. easier to compare? Does JS have .equals()?
  2. Shared behavior. toString, toJSON the same.
  3. js.spec?
  4. Is immutability more possible? https://www.everythingfrontend.com/posts/immutable-classes-in-javascript.html
 */
export abstract class Identifier<VALUE> {
  /**
   * The value of the Identifier.
   */
  readonly value: VALUE;

/*
Codec is causing generics problems. What if instead of passing in IdentifierCodec, We extend Identifier with types,
like BooleanCodec and such? That way they could hide their codec internally and we wouldn't have so much trouble with
the generic declaration.

Also might be able to move encodeToString() into this class? If so then it would not need to be exported. Public interface
would just be:

  factory...
  decodeFromString()
  jsonParserReviver (passed into JSON.parse()
 */
  constructor(value: VALUE) {
    this.value = value;
  }

  protected abstract codec(): IdentifierCodec;

  /**
   * Short string name the type of the Identifier. Examples include 'uuid', 'date', 'geo'.
   */
  type(): string {
    return this.codec().type;
  }


  toUriString(): string {
    return encodeToString(this, true, this.codec());
  }

  toString(): string {
    return encodeToString(this, false, this.codec());
  }

  toJSON(key: string): string {
    return this.toString();
  }
}


/**
 * Codec that prepares an Identifier for encoding as well as creates an Identifier from a decoded object.
 */
export interface IdentifierCodec<INPUT = INPUT, VALUE = INPUT, ENCODED = VALUE> {

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
   * @param value the value to prepare
   * @returns the prepared value
   */
  encode(value: VALUE): ENCODED;

  /**
   * Converts a encoded value into an Identifier's value. This function should throw an Error if the
   * decoded type is wrong.
   * @param the encoded value
   * @returns The identifier value
   */
  decode(decoded: ENCODED): VALUE;
}