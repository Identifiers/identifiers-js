import {expect} from "chai";
import * as msgpack from "msgpack-lite";

import * as encode from "../src/encode";
import {Identifier} from "../src/identifier";
import {codecSymbol} from "../src/shared";

describe("encode tests", () => {

  it("findCodec() throws an error with an identifier that is missing a codec", () => {
    const id: Identifier<string> = {
      type: "string",
      value: "boo"
    };
    expect(() => encode.findCodec(id)).to.throw;
  });


  it("findCodec() throws an error when a codec cannot encode a value", () => {
    const codec = {
      validateForEncoding: (value) => {
        throw new Error();
      }
    };
    const id: Identifier<number> = {
      type: "string",
      value: 22,
      [codecSymbol]: codec
    };

    expect(() => encode.findCodec(id)).to.throw;
  });


  it("findCodec() calls a codec's validateForEncoding()", () => {
    let called = false;

    const codec = {
      validateForEncoding: (value) => {
        called = true;
        return;
      }
    };
    const id = {
      type: "number",
      value: 22,
      [codecSymbol]: codec
    };

    encode.findCodec(id);

    expect(called).to.be.true;
  });


  it("encodeToBytes() returns the correct msgpack structure", () => {
    const code = 1;
    const value = "watermelon soup";

    const bytes = encode.encodeToBytes(code,value);
    expect(bytes).to.be.a("uint8array");

    const actual: [number, string] = msgpack.decode(bytes);
    expect(actual).to.have.members([code, value]);
  })
});
