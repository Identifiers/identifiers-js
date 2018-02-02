import {expect} from "chai";
import * as msgpack from "msgpack-lite";

import * as encode from "../src/encode";
import {testCodec} from "./tests-shared";
import {IDTuple} from "../src/shared";

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
    const valueTuple: IDTuple<string> = [1, "soup"];

    const bytes = encode.encodeBytes(valueTuple);
    expect(bytes).to.be.a("uint8array");
    expect(Array.from(bytes)).to.have.ordered.members([146, 1, 164, 115, 111, 117, 112]);

    const actual = msgpack.decode(bytes);
    expect(actual).to.have.ordered.members(valueTuple);
  });
});
