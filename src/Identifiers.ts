import * as base128 from "./base128";
import * as msgpack from "msgpack-lite";


export function fromEncodedString(encoded: string): any {
  /*
    Things that can go wrong:
    1. undefined
    2. Not a string
    3. Not a base128 encoded string
    4. An already-decoded identifier

    For #4 I think I want to use a Symbol to tell me that I've seen this before
  */
  const bytes = base128.decode(encoded);
  return msgpack.decode(bytes);
}