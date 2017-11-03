import {encode, decode} from "../../src/base128";
import {expect} from "chai";
import * as faker from "faker";
import * as msgpack from "msgpack-lite";
import {REGEXP} from "../../src/base128/constants";

describe("round-trip with long library", () => {

  it("handles empty values", () => {
    const empty = Uint8Array.from([]);
    const testEnc = encode(empty);
    expect(testEnc).to.equal("þ");
    const testDec = decode(testEnc);
    expect(bytesToArray(testDec)).to.contain.members([]);
  });

  it("throws error decoding incorrect values", () => {
    expect(() => decode("")).to.throw();
    expect(() => decode("Not an encoded string")).to.throw();
    expect(() => decode("messed-upþ")).to.throw();
    expect(() => decode("qþ")).to.throw();
    expect(() => decode("1þþ")).to.throw();
  });

  it("converts a known single-character value to and from base 128", () => {
    //single character 'm'
    const m = Uint8Array.from([109]);
    const testEnc = encode(m);
    expect(testEnc).to.equal("pzþ");
    const testDec = decode(testEnc);
    expect(bytesToArray(testDec)).to.contain.members(bytesToArray(m));
  });

  it("converts a known string value using msgpack to and from base 128", () => {
    const bytes = stringToBytes("Matt Bishop");
    const testEnc = encode(bytes);
    expect(testEnc).to.equal("ÓÑfKWÎzÀnÚë5ùzþ");
    const testDec = decode(testEnc);
    expect(bytesToArray(testDec)).to.contain.members(bytesToArray(bytes));
  });

  it("converts random numbers using msgpack to and from base 128", () => {
    const numbers = [];
    const bytes = [];
    for (let i = 0; i < 100000; i++) {
      const num = Math.random();
      numbers.push(num);
      bytes.push(msgpack.encode(num));
    }
    console.time("num: " + bytes.length.toString());
    bytes.forEach(barr => roundTrip(barr));
    console.timeEnd("num: " + bytes.length.toString());
  }).timeout(0);

  it("converts random string values to and from base 128", () => {
    const strings = [];
    for (let i = 0; i < 20000; i++) {
      strings.push(
        faker.lorem.slug(),
        faker.internet.url(),
        faker.internet.email(),
        faker.date.recent().toString(),
        faker.random.uuid());
    }
    const bytes = strings.map(str => stringToBytes(str));
    console.time("str: " + bytes.length.toString());
    bytes.forEach(barr => roundTrip(barr));
    console.timeEnd("str: " + bytes.length.toString());
  }).timeout(0);
});

function bytesToArray(bytes: Uint8Array): Array<number> {
  const array = new Array(bytes.length);
  bytes.forEach(value => array.push(value));
  return array;
}

function stringToBytes(value: string): Uint8Array {
  return msgpack.encode(value);
}

function roundTrip(bytes: Uint8Array): void {
  const testEnc = encode(bytes);
  const testDec = decode(testEnc);
  // note these expectation checks take up 95% of the time in this test
  expect(bytesToArray(testDec)).to.contain.members(bytesToArray(bytes));
  expect(testEnc).to.match(REGEXP);
}
