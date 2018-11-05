import * as base32dec from "../src/base32/decode";
import * as base32enc from "../src/base32/encode";
import * as base128dec from "../src/base128/decode";
import * as base128enc from "../src/base128/encode";

import * as benchmark from "benchmark";
import * as faker from "faker";
import * as msgpack from "msgpack-typed-numbers";

const suite = new benchmark.Suite("codecs");
const randomBytes: Uint8Array[] = [];
for (let i = 0; i < 10; i++) {
  const bytes = new Array(100);
  for (let b = 0; b < 20; b++) {
    bytes[b] = Math.floor(0xff * Math.random());
  }
  randomBytes.push(Uint8Array.from(bytes));
}

const strings: string[] = [];
for (let i = 0; i < 2; i++) {
  strings.push(
    faker.lorem.slug(),
    faker.internet.url(),
    faker.internet.email(),
    faker.date.recent().toString(),
    faker.random.uuid());
}
const strBytes = strings.map(str => msgpack.encode(str));

console.log("codec benchmark started");
suite
  .add("base32 identifier values", base32RandomValuesTest)
  .add("base32 random bytes", base32RandomBytesTest)
  .add("base128 identifier values", base128RandomValuesTest)
  .add("base128 random bytes", base128RandomBytesTest)
  .on("cycle", (event: benchmark.Event) => console.log(`step: ${event.target}`))
  .run();

function roundTripBase32(bytes: Uint8Array): void {
  const testEnc = base32enc.encode(bytes);
  const testDec = base32dec.decode(testEnc);
  if (!testDec) {
    throw new Error(`Could not decode ${testEnc}`);
  }
}

function roundTripBase128(bytes: Uint8Array): void {
  const testEnc = base128enc.encode(bytes);
  const testDec = base128dec.decode(testEnc);
  if (!testDec) {
    throw new Error(`Could not decode ${testEnc}`);
  }
}

function base32RandomBytesTest() {
  roundTripBase32(randomBytes[Math.floor(Math.random() * 10)]);
}

function base32RandomValuesTest() {
  roundTripBase32(strBytes[Math.floor(Math.random() * 10)]);
}

function base128RandomBytesTest() {
  roundTripBase128(randomBytes[Math.floor(Math.random() * 10)]);
}

function base128RandomValuesTest() {
  roundTripBase128(strBytes[Math.floor(Math.random() * 10)]);
}
