/**
 * Identifier-centric immutable wrapper around a Date instance. It provides the Date methods often used in system that
 * treat dates as identifiers. One can get a Date instance for other cases.
 */
 //todo consider class instead of interface
export interface ImmutableDate {

  /**
   * The time value.
   */
  readonly time: number;

  /**
   * Same as Date.toString()
   */
  toString(): string;

  /**
   * Same as Date.toUTCString()
   */
  toUTCString(): string;

  /**
   * Same as Date.toISOString()
   */
  toISOString(): string;

  /**
   * Same as Date.toJSON()
   */
  toJSON(key?: string): string;

  /**
   * Returns a copy of the wrapped Date instance
   */
  toDate(): Date;
}

/**
 * Creates an immutable date instance.
 * @param value can be either a timestamp number or a Date instance
 * @returns an ImmutableDate instance
 */
export function createImmutableDate(value: number| Date): ImmutableDate {
  const time = typeof value === "number" ? value : value.getTime();
  const date = new Date(time);
  return Object.freeze({
    time: time,
    toString: () => date.toString(),
    toUTCString: () => date.toUTCString(),
    toISOString: () => date.toISOString(),
    toJSON: () => date.toJSON(),
    toDate: () => new Date(time)
  });
}