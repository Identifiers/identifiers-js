import {expect} from "chai";

import {codecForTypeCode} from "../../src/types/finder";
import {anyCodec, stringCodec, booleanCodec, floatCodec, integerCodec, longCodec} from "../../src/types/primitives";
import {datetimeCodec} from "../../src/types/semantics";

describe("codec finder", () => {

  it("throws error if it can't find a codec", () => {
    expect(() => codecForTypeCode(-200)).to.throw();
  });


  it("finds the any codec", () => {
    const actual = codecForTypeCode(anyCodec.typeCode);
    expect(actual).to.equal(anyCodec);
  });


  it("finds string codec", () => {
    const actual = codecForTypeCode(stringCodec.typeCode);
    expect(actual).to.equal(stringCodec);
  });


  it("finds boolean codec", () => {
    const actual = codecForTypeCode(booleanCodec.typeCode);
    expect(actual).to.equal(booleanCodec);
  });


  it("finds float codec", () => {
    const actual = codecForTypeCode(floatCodec.typeCode);
    expect(actual).to.equal(floatCodec);
  });


  it("finds integer codec", () => {
    const actual = codecForTypeCode(integerCodec.typeCode);
    expect(actual).to.equal(integerCodec);
  });


  it("finds long codec", () => {
    const actual = codecForTypeCode(longCodec.typeCode);
    expect(actual).to.equal(longCodec);
  });


  it("finds datetime codec", () => {
    const actual = codecForTypeCode(datetimeCodec.typeCode);
    expect(actual).to.equal(datetimeCodec);
  });


  it("downgrades to a baser codec", () => {
    const actual = codecForTypeCode(integerCodec.typeCode + 192);
    expect(actual).to.equal(integerCodec);
  });
});