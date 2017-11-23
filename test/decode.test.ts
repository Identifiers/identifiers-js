import * as chai from "chai";
import {expect} from "chai";
import * as msgpack from "msgpack-lite";

import * as base128 from "../src/base128/encode";
import * as decode from "../src/decode";
import {IdentifierCodec} from "../src/identifier";
import jsSpecChai from "js.spec-chai";
import {anyCodec} from "../src/types/any";
import {identifierSpec} from "./test-shared";

chai.use(jsSpecChai);

describe("decode tests", () => {

  it("decodes base128 string input", () => {
    const bytes = Uint8Array.from([1, 2, 3]);
    const value = base128.encode(bytes);
    const actual = decode.decodeString(value);
    expect(actual).to.deep.equal(bytes);
  });


  it("fails with non-string input", () => {
    expect(() => decode.decodeString(78)).to.throw();
  });


  it("decodes correct msgpack bytes", () => {
    const value = [1, {"bark": 1}];
    const packed = msgpack.encode(value);
    const actual = decode.decodeBytes(packed);
    expect(actual).to.deep.equal(value);
  });


  it("fails with incorrect packed structure, but correct msgpack bytes", () => {
    const value = {"bite": 0};
    const packed = msgpack.encode(value);
    expect(() => decode.decodeBytes(packed)).to.throw();
  });


  it("fails with too long of an array, but correct msgpack bytes", () => {
    const value = [1, "hello", "too many"];
    const packed = msgpack.encode(value);
    expect(() => decode.decodeBytes(packed)).to.throw();
  });


  it("decodeWithCodec() calls a codec's decode methods", () => {
    let called = false;
    const codec = {
      validateForDecoding: (value) => {
        called = true;
        return;
      },
      decode: (value) => value + 1
    } as IdentifierCodec;
    const value = 22;

    const actual = decode.decodeWithCodec(codec, value);
    expect(actual).to.equal(value + 1);
    expect(called).to.equal(true);
  });


  it("creates an identifier with the correct shape", () => {
    const value = "banana";

    const actual = decode.createIdentifier(anyCodec, value);

    expect(actual).to.conform(identifierSpec);
    expect(actual).to.include({type: anyCodec.type, value: value});
  });
});