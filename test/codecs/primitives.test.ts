import {expect} from "chai";

import {booleanCodec, datetimeCodec, floatCodec, integerCodec, stringCodec} from "../../src/codecs/primitives";


describe("primitive codecs", () => {

  it("supports string encoding", () => {
    const value = "ballast";
    expect(() => stringCodec.validateForEncoding(value)).to.not.throw;
    expect(() => stringCodec.validateForEncoding(1)).to.throw;
    const actual = stringCodec.encode(value);
    expect(actual).to.equal(value);
  });


  it("supports boolean encoding", () => {
    const value = true;
    expect(() => booleanCodec.validateForEncoding(value)).to.not.throw;
    expect(() => booleanCodec.validateForEncoding(1)).to.throw;
    const actual = booleanCodec.encode(value);
    expect(actual).to.equal(value);
  });


  it("supports float encoding", () => {
    const value = 22.5;
    expect(() => floatCodec.validateForEncoding(value)).to.not.throw;
    expect(() => floatCodec.validateForEncoding(200)).to.throw;
    const actual = floatCodec.encode(value);
    expect(actual).to.equal(value);
  });


  it("supports integer encoding", () => {
    const value = -205;
    expect(() => integerCodec.validateForEncoding(value)).to.not.throw;
    expect(() => integerCodec.validateForEncoding(20.223)).to.throw;
    const actual = integerCodec.encode(value);
    expect(actual).to.equal(value);
  });


  it("supports datetime encoding", () => {
    const value = new Date();
    expect(() => datetimeCodec.validateForEncoding(value)).to.not.throw;
    expect(() => datetimeCodec.validateForEncoding("not a date")).to.throw;
    const actual = datetimeCodec.encode(value);
    expect(actual).to.equal(value.getTime());
  });
});