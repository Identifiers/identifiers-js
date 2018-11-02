import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);

import {datetimeCodec} from "../../src/types/datetime";
import {createImmutableDate} from "../../src/types/immutable-date";


describe("datetime codec", () => {
  it("validates good identifier values", () => {
    expect(new Date()).to.conform(datetimeCodec.specForIdentifier);
    expect(33779563).to.conform(datetimeCodec.specForIdentifier);
  });

  it("rejects bad identifier values", () => {
    expect("2017-12-16T21:38:00.300Z").to.not.conform(datetimeCodec.specForIdentifier);
    expect(224.3).to.not.conform(datetimeCodec.specForIdentifier);
  });

  it("supports encoding", () => {
    const value = createImmutableDate(new Date());
    const actual = datetimeCodec.encode(value) as Long;
    expect(actual.toNumber()).to.equal(value.time);
  });

  it("validates good decoded values", () => {
    expect(3945873).to.conform(datetimeCodec.specForDecoding);
  });

  it("rejects decoding bad values", () => {
    expect(new Date()).to.not.conform(datetimeCodec.specForDecoding);
    expect("2017-12-16T21:38:00.300Z").to.not.conform(datetimeCodec.specForDecoding);
    expect(3345.2).to.not.conform(datetimeCodec.specForDecoding);
  });

  it("supports decoding", () => {
    const value = new Date().getTime();
    const actual = datetimeCodec.decode(value);
    expect(actual.time).to.equal(value);
  });
});