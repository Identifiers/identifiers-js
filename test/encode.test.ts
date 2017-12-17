import {expect} from "chai";
import * as msgpack from "msgpack-lite";
import * as S from "js.spec";

import * as encode from "../src/encode";
import {asIsCodec} from "../src/types/shared-types";

describe("encode tests", () => {

  const codec = {
    ...asIsCodec,
    typeCode: 0,
    type: "test",
    specForIdentifier: S.spec.number,
    specForDecoding: S.spec.nil
  };

  it("encodeWithCodec() throws an error when a codec cannot encode a value", () => {
    expect(() => encode.encodeWithCodec(codec, "22")).to.throw();
  });


  it("encodeWithCodec() calls a codec's encoding methods", () => {
    const value = 768;

    const spyCodec = {
      ...codec,
      forIdentifier: (value) => {
        return value + 10;
      },
      encode: (value) => value + 1
    };

    const actual = encode.encodeWithCodec(spyCodec, value);

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
