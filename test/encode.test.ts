import {expect} from "chai";

import * as encode from "../src/encode";
import {Identifier} from "../src/identifier";
import {codecSymbol} from "../src/shared";

describe("encode.findCodec() tests", () => {

  it("throws an error with an identifier that is missing a codec", () => {
    const id: Identifier<string> = {
      type: "string",
      value: "boo"
    };
    expect(() => encode.findCodec(id)).to.throw;
  });

  it("throws an error when a codec cannot encode a value", () => {
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

  it("calls a codec's validateForEncoding method", () => {
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

    const actual = encode.findCodec(id);
    expect(called).to.be.true;
  });
});
