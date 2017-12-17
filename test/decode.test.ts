import * as chai from "chai";
import {expect} from "chai";
import * as msgpack from "msgpack-lite";

import * as base128 from "../src/base128/encode";
import * as decode from "../src/decode";
import jsSpecChai from "js.spec-chai";
import {anyCodec} from "../src/types/any";
import {identifierSpec} from "./test-shared";
import {asIsCodec} from "../src/types/shared-types";
import * as S from "js.spec";

chai.use(jsSpecChai);

describe("decode tests", () => {

  it("decodes base128 string input", () => {
    const bytes = Uint8Array.from([1, 2, 3]);
    const value = base128.encode(bytes);
    const actual = decode.decodeString(value);
    expect(actual).to.deep.equal(bytes);
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


    const codec = {
      ...asIsCodec,
      typeCode: 0,
      type: "test",
      specForIdentifier: S.spec.nil,
      specForDecoding: S.spec.number,
      decode: (value) => value + 1
    };

  it("decodeWithCodec() throws error on invalid decode value", () => {
    expect(()=> decode.decodeWithCodec(codec, "beetle")).to.throw();
  });

  it("decodeWithCodec() calls a codec's decode methods", () => {
    const value = 22;
    const actual = decode.decodeWithCodec(codec, value);
    expect(actual).to.equal(value + 1);
  });


  it("creates an identifier with the correct shape", () => {
    const value = "banana";
    const actual = decode.createIdentifier(anyCodec, value);
    expect(actual).to.conform(identifierSpec);
    expect(actual).to.include({type: anyCodec.type, value: value});
  });
});