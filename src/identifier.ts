/**
 * Contains the value and type of an Identifier value. Also has functions to generate string values for different uses.
 */
export interface Identifier<VALUE> {

  /**
   * Short string name the type of the Identifier. Examples include 'uuid', 'integer', 'geo'.
   */
  readonly type: string;

  /**
   * The value of the Identifier.
   */
  readonly value: VALUE;

  /**
   * Returns a debug-friendly string of the identifier's value.
   */
  toString(): string;

  /**
   * Returns the identifier encoded as a base-128 string.
   */
  toDataString(): string;

  /**
   * Returns the identifier encoded in a human-usable Crockford base-32 format. This string is URI safe and case-insensitive.
   */
  toHumanString(): string;

  /**
   * Converts the identifier to a base-128 JSON string.
   */
  toJSON(key?: string): string;
}
