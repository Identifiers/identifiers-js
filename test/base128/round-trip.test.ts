import {encode, decode} from "../../src/base128";
import {REGEXP} from "../../src/base128/constants";
import {expect} from "chai";


describe("round-trip with long library", () => {

  it("throws error decoding incorrect values", () => {
    expect(() => decode("")).to.throw();
    expect(() => decode("Not an encoded string")).to.throw();
    expect(() => decode("messed-upþ")).to.throw();
    expect(() => decode("qþ")).to.throw();
    expect(() => decode("1þþ")).to.throw();
  });

  it("handles empty values", () => {
    const empty = Uint8Array.of();
    const testEnc = encode(empty);
    expect(testEnc).to.equal("þ");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(empty);
  });

  it("converts a known single-character value to and from base 128", () => {
    const m = Uint8Array.of("m".charCodeAt(0));
    const testEnc = encode(m);
    expect(testEnc).to.equal("pzþ");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(m);
  });

  it("converts a known string value to and from base 128", () => {
    const bytes = Uint8Array.from(
      "Matt Bishop"
        .split("")
        .map(char => char.charCodeAt(0)));
    const testEnc = encode(bytes);
    expect(testEnc).to.equal("ZÖhÅU03çsØAõ/þ");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(bytes);
  });

  it("converts random byte arrays to and from base 128", () => {
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
