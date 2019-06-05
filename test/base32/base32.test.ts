import {expect} from "chai";

import {decode, DECODE_ALIASES, REGEXP} from "../../src/base32/decode";
import {encode} from "../../src/base32/encode";
import {toCharCode} from "../../src/shared";


describe("base32 tests", () => {

  it("handles illegal characters in an encoded string", () => {
    expect(() => decode("/a0")).to.throw();
  });

  it("handles incorrect check digit", () => {
    expect(() => decode("dm0")).to.throw();
  });

  it("handles empty values", () => {
    const empty = Uint8Array.of();
    const testEnc = encode(empty);
    expect(testEnc).to.equal("0"); // 0 is check digit
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(empty);
  });

  it("converts a known single-character value to and from base32", () => {
    const m = Uint8Array.of(toCharCode("m"));
    const testEnc = encode(m);
    expect(testEnc).to.equal("dm=");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(m);
  });

  it("converts a known single-character value with a code point > 128 to and from base 128", () => {
    const y = Uint8Array.of(toCharCode("ÿ"));
    const testEnc = encode(y);
    expect(testEnc).to.equal("zw~");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(y);
  });

  it("converts a known small single-byte array to and from base32", () => {
    const one = Uint8Array.of(1);
    const testEnc = encode(one);
    expect(testEnc).to.equal("041");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(one);
  });

  it("converts a 5-character string value to and from base32", () => {
    const bytes = Uint8Array.from(
      Array.from("green").map(toCharCode));
    const testEnc = encode(bytes);
    expect(testEnc).to.equal("cxs6asbeb");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(bytes);
  });

  it("converts a longer string value to and from base32", () => {
    const bytes = Uint8Array.from(
      Array.from("yellow").map(toCharCode));
    const testEnc = encode(bytes);
    expect(testEnc).to.equal("f5jprv3few2");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(bytes);
  });

  it("converts a higher-value byte array", () => {
    const expected = "xkakcp";
    const bytes = Uint8Array.of(236, 213, 54);  //[-20, -43, 54]

    const actualBytes = decode(expected);
    expect(actualBytes).to.deep.equal(bytes);

    const actualStr = encode(bytes);
    expect(actualStr).to.equal(expected);
  });

  it("understands the base32 alias characters", () => {
    const testEnc = "00011111abcdefghjkmnpqrstvwxyzabcdefghjkmnpqrstvwxyzh";
    const aliasedEnc = "0Oo1iIlLabcdefghjkmnpqrstvwxyzABCDEFGHJKMNPQRSTVWXYZH";
    const testDec = decode(testEnc);
    const aliasedDec = decode(aliasedEnc);
    expect(testDec).to.deep.equal(aliasedDec);
  });

  it("converts random byte arrays to and from base32", () => {
    const bytes: Uint8Array[] = [];
    for (let i = 1; i < 500; i++) {
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
  const testEnc = randomizeAliases(encode(bytes));
  const testDec = decode(testEnc);
  // note these expectations take up 95% of the time in this test
  expect(testEnc).to.be.a("string");
  expect(testDec).to.be.a("uint8array");
  expect(testEnc).to.match(REGEXP);
  expect(testDec).to.deep.equal(bytes);
}

function randomizeAliases(original: string): string {
  return original.replace(/[01]/, (match) => {
    const aliases = DECODE_ALIASES[match];
    const aliasPos = Math.floor(Math.random() * (aliases.length + 1));
    //Don't always return an alias
    return aliasPos < aliases.length
      ? aliases[aliasPos]
      : match;
  });
}
