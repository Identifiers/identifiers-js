import {PREFIX} from "../../src/base32/constants";
import {expect} from "chai";

import {decode, DECODE_ALIASES, REGEXP} from "../../src/base32/decode";
import {encode} from "../../src/base32/encode";


describe("base32 tests", () => {

  it("handles empty values", () => {
    const empty = Uint8Array.of();
    const testEnc = encode(empty);
    expect(testEnc).to.equal(PREFIX);
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(empty);
  });

  it("converts a known single-character value to and from base32", () => {
    const m = Uint8Array.of("m".charCodeAt(0));
    const testEnc = encode(m);
    expect(testEnc).to.equal("_dm=");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(m);
  });

  it("converts a known small single-byte array to and from base32", () => {
    const one = Uint8Array.of(1);
    const testEnc = encode(one);
    expect(testEnc).to.equal("_041");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(one);
  });

  it("converts a known string value to and from base32", () => {
    const bytes = Uint8Array.from(
      Array.from("green")
        .map(char => char.charCodeAt(0)));
    const testEnc = encode(bytes);
    expect(testEnc).to.equal("_cxs6asbeb");
    const testDec = decode(testEnc);
    expect(testDec).to.deep.equal(bytes);
  });

  it("understands the base32 alias characters", () => {
    const testEnc = "_00011111abcdefghjkmnpqrstvwxyzabcdefghjkmnpqrstvwxyzh";
    const aliasedEnc = "_0Oo1iIlLabcdefghjkmnpqrstvwxyzABCDEFGHJKMNPQRSTVWXYZH";
    const testDec = decode(testEnc);
    const aliasedDec = decode(aliasedEnc);
    expect(testDec).to.deep.equal(aliasedDec);
  });

  it("converts random byte arrays to and from base32", () => {
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
  const testEnc = randomizeAliases(encode(bytes));
  const testDec = decode(testEnc);
  // note these expectation checks take up 95% of the time in this test
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
