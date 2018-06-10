import {decode} from "../src/base32/decode";
import {encode} from "../src/base32/encode";
import {msgpackCodec} from "../src/shared";

import * as benchmark from "benchmark";
import * as faker from "faker";
import * as msgpack from "msgpack-lite";

const encoderOptions = { codec: msgpackCodec };
const suite = new benchmark.Suite("base32");
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
const strBytes = strings.map(str => msgpack.encode(str, encoderOptions));

console.log("base32 benchmark started");
suite
  .add("random bytes", randomBytesTest)
  .add("identifier values", randomValuesTest)
  .on("cycle", (event: benchmark.Event) => console.log(`step: ${event.target}`))
  .run();

function roundTrip(bytes: Uint8Array): void {
  const testEnc = encode(bytes);
  const testDec = decode(testEnc);
  if (!testDec) {
    throw new Error(`Could not decode ${testEnc}`);
  }
}

function randomBytesTest() {
  roundTrip(randomBytes[Math.floor(Math.random() * 10)]);
}

function randomValuesTest() {
  roundTrip(strBytes[Math.floor(Math.random() * 10)]);
}
