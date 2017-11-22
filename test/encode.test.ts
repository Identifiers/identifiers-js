import {expect} from "chai";
import * as msgpack from "msgpack-lite";

import * as encode from "../src/encode";
import {Identifier} from "../src/identifier";
import {codecSymbol} from "../src/shared";
import {IdentifierCodec} from "../src/identifier";
import * as primitives from "../src/types/primitives";


describe("encode tests", () => {

  it("findCodec() throws an error with an identifier that is missing a codec", () => {
    const id: Identifier<string> = {
      type: "string",
      value: "boo"
    };
    expect(() => encode.findCodec(id)).to.throw();
  });


  it("findCodec() successfully finds a codec on an identifier", () => {
    const id: Identifier<string> = {
      type: "string",
      value: "boo",
      [codecSymbol]: primitives.anyCodec
    };
    expect(() => encode.findCodec(id)).to.not.throw();
  });


  it("encodeWithCodec() throws an error when a codec cannot encode a value", () => {
    const codec = {
      validateForIdentifier: (value) => {
        //Convinces typescript compiler that the return statement is reachable
        if (new Date().getTime() > 0) {
          throw new Error();
        }
        return;
      }
    } as IdentifierCodec;

    expect(() => encode.encodeWithCodec(codec, 22)).to.throw();
  });


  it("encodeWithCodec() calls a codec's encoding methods", () => {
    let calledValidate = false;
    const value = 768;

    const codec = {
      validateForIdentifier: (value) => {
        calledValidate = true;
        return;
      },
      forIdentifier: (value) => {
        return value + 10;
      },
      encode: (value) => value + 1
    } as IdentifierCodec;

    const actual = encode.encodeWithCodec(codec, value);

    expect(calledValidate).to.equal(true);
    // value changed by correct amount means the encoding function used the return values of the codec
    expect(actual).to.equal(value + 11);
  });


  it("encodeBytes() returns the correct msgpack structure", () => {
    const code = 1;
    const value = "watermelon soup";

    const bytes = encode.encodeBytes(code, value);
    expect(bytes).to.be.a("uint8array");

    const actual: [number, string] = msgpack.decode(bytes);
    expect(actual).to.have.members([code, value]);
  });
});
