import {decodeFromString} from "./decode";

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
