import {PREFIX, REGEXP} from "../../src/crockford32/constants";
import {expect} from "chai";

import {decode} from "../../src/crockford32/decode";
import {encode} from "../../src/crockford32/encode";


describe("crockford32 round-trip", () => {

  it("throws error decoding incorrect values", () => {
    expect(() => decode("")).to.throw();
    expect(() => decode("Not an encoded string")).to.throw();
    expect(() => decode(`${PREFIX}messed-up`)).to.throw();
    expect(() => decode(`${PREFIX}p`)).to.throw();
    expect(() => decode(`${PREFIX}${PREFIX}12`)).to.throw();
  });

  it("handles empty values", () => {
    const empty = Uint8Array.of();
    const testEnc = encode(empty);
    expect(testEnc).to.equal(PREFIX);
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(empty);
  });

  it("converts a known single-character value to and from base 32", () => {
    const m = Uint8Array.of("m".charCodeAt(0));
    const testEnc = encode(m);
    expect(testEnc).to.equal("_nu"); // binary: 1101101
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(m);
  });

  it("converts a known string value to and from base 32", () => {
    const bytes = Uint8Array.from(
      "green"
        .split("")
        .map(char => char.charCodeAt(0)));
    const testEnc = encode(bytes);
    expect(testEnc).to.equal("_m5zgkzlo");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(bytes);
  });

  it("converts random byte arrays to and from base 32", () => {
    const bytes: Uint8Array[] = [];
    for (let i = 1; i < 1000; i++) {
      const byteArray: number[] = [];
      for (let b = 0; b < i; b++) {
        byteArray[b] = Math.floor(Math.random() * 256);
      }
      bytes.push(Uint8Array.from(byteArray));
    }
    bytes.forEach(barr => roundTrip(barr));
  });
});

function roundTrip(bytes: Uint8Array): void {
  const testEnc = encode(bytes);
  const testDec = decode(testEnc);
  // note these expectation checks take up 95% of the time in this test
  expect(testEnc).to.be.a("string");
  expect(testDec).to.be.a("uint8array");
  expect(testEnc).to.match(REGEXP);
  expect(testDec).to.deep.equal(bytes);
}
