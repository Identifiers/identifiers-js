import * as chai from "chai";
import {expect} from "chai";
import * as S from "js.spec";
import * as msgpack from "msgpackr";

import * as decode from "../src/decode";
import {asIsCodec} from "../src/types/shared-types";

import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);


describe("decode tests", () => {

  it("throws error decoding incorrect values", () => {
    expect(() => decode.decodeString("Not an encoded string")).to.throw();
    expect(() => decode.decodeString("'messed-up'")).to.throw();
    expect(() => decode.decodeString("q")).to.throw();
    expect(() => decode.decodeString("1")).to.throw();
    expect(() => decode.decodeString("_messed-up")).to.throw();
    expect(() => decode.decodeString("_p")).to.throw();
    expect(() => decode.decodeString("__12")).to.throw();
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
    specForIdentifier: S.spec.predicate("nil", S.spec.nil),
    specForDecoding: S.spec.predicate("number", S.spec.number),
    decode: (value: number) => value + 1
  };

  it("decodeWithCodec() throws error on invalid decode value", () => {
    expect(()=> decode.decodeWithCodec(codec, "beetle")).to.throw();
  });

  it("decodeWithCodec() calls a codec's decode methods", () => {
    const value = 22;
    const actual = decode.decodeWithCodec(codec, value);
    expect(actual).to.equal(value + 1);
  });
});