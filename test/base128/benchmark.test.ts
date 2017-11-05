import {encode, decode} from "../../src/base128";
import * as faker from "faker";
import * as msgpack from "msgpack-lite";
import * as Benchmark from "benchmark";


describe("benchmark base-128", () => {

  it("converts random numbers using msgpack to and from base 128", () => {

    const suite = new Benchmark.Suite();
    const numbers = [];
    const numBytes: Array<Uint8Array> = [];
    for (let i = 0; i < 10; i++) {
      const num = Math.trunc(100000000 * Math.random());
      numbers.push(num);
      numBytes.push(msgpack.encode(num));
    }

    const strings = [];
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
      .on("cycle", (event: Benchmark.Event) => console.log(`step: ${event.target}`))
      .run();
  }).timeout(0);
});

function roundTrip(bytes: Uint8Array): void {
  const testEnc = encode(bytes);
  const testDec = decode(testEnc);
}
