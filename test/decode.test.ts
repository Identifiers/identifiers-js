import * as base128 from "../src/base128"
import {expect} from "chai";
import * as msgpack from "msgpack-lite";
import * as S from "js.spec";

import * as decode from "../src/decode";
import {IdentifierCodec} from "../src/identifier";
import {identifierSpec} from "../src/shared";


describe("decode tests", () => {

  it("decodes base128 string input", () => {
    const bytes = Uint8Array.from([1, 2, 3]);
    const value = base128.encode(bytes);
    const actual = decode.decodeString(value);
    expect(actual).to.deep.equal(bytes);
  });


  it("fails with non-string input", () => {
    expect(() => decode.decodeString(78)).to.throw;
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
    expect(() => decode.decodeBytes(packed)).to.throw;
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
    expect(called).to.be.true;
  });


  it("creates an identifier with the correct shape", () => {
    const codec = {type: 100};
    const value = "banana";

    const actual = decode.createIdentifier(codec, value);

    expect(S.valid(identifierSpec, actual)).to.be.true;
    expect(actual).to.include({type: codec.type, value: value});
  });
});