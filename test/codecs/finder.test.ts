import {expect} from "chai";

import {codecForCodeType} from "../../src/codecs/finder";
import {booleanCodec, datetimeCodec, floatCodec, integerCodec, stringCodec} from "../../src/codecs/primitives";

describe("primitive codecs", () => {

  it("throws error if it can't find a codec", () => {
    expect(() => codecForCodeType(-200)).to.throw;
  });


  it("finds string codec", () => {
    const actual = codecForCodeType(stringCodec.typeCode);
    expect(actual).to.equal(stringCodec);
  });


  it("finds boolean codec", () => {
    const actual = codecForCodeType(booleanCodec.typeCode);
    expect(actual).to.equal(booleanCodec);
  });


  it("finds float codec", () => {
    const actual = codecForCodeType(floatCodec.typeCode);
    expect(actual).to.equal(floatCodec);
  });


  it("finds integer codec", () => {
    const actual = codecForCodeType(integerCodec.typeCode);
    expect(actual).to.equal(integerCodec);
  });


  it("finds datetime codec", () => {
    const actual = codecForCodeType(datetimeCodec.typeCode);
    expect(actual).to.equal(datetimeCodec);
  });
});