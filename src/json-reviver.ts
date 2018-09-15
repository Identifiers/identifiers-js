import {decodeFromString} from "./decode";

/**
 * JavaScript's JSON.parse() function can take a reviver function to parse data elements in JSON values.
 * Use this function to parse encoded Identifier strings into Identifier instances. This function will ignore
 * JSON strings that are not encoded Identifier strings.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Syntax
 */
export function JSON_reviver(key: string, value: any): any {
  if (typeof value === "string") {
    try {
      return decodeFromString(value);
    } catch {
      //do nothing, not an encoded identifier
    }
  }
  return value;
}
