import {encode} from "./encode";
import {decode} from "./decode";
import * as faker from "faker";
import * as msgpack from "msgpack-long-lite";
import * as benchmark from "benchmark";

/*
Doesn't work on OS X :(
sudo dtrace -n 'profile-97/execname == "node" && arg1/{@[jstack(150, 8000)] = count(); } tick-60s { exit(0); }' > stacks.out
 */

const suite = new benchmark.Suite();
const numbers: number[] = [];
const numBytes: Uint8Array[] = [];
for (let i = 0; i < 10; i++) {
  const num = Math.trunc(100000000 * Math.random());
  numbers.push(num);
  numBytes.push(msgpack.encode(num));
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

suite
  .add("10 random numbers", () => numBytes.forEach(barr => roundTrip(barr)))
  .add("10 identifier strings", () => strBytes.forEach(barr => roundTrip(barr)))
  .on("cycle", (event) => console.log(`step: ${event.target}`))
  .run();

function roundTrip(bytes: Uint8Array): void {
  const testEnc = encode(bytes);
  const testDec = decode(testEnc);
}
