import {expect} from "chai";
import * as msgpack from "msgpack-lite";

import * as encode from "../src/encode";
import {testCodec} from "./tests-shared";

describe("encode tests", () => {

  it("encodeWithCodec() calls a codec's encoding methods", () => {
    const value = 768;

    const spyCodec = {
      ...testCodec,
      encode: (value) => value + 1
    };

    const actual = encode.encodeWithCodec(spyCodec, value);

    // value changed by correct amount means the encoding function used the return values of the codec
    expect(actual).to.equal(value + 1);
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
