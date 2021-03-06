import {expect} from "chai";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
chai.use(jsSpecChai);

import {geoCodec} from "../../src/types/geo";
import {Float} from "msgpack-typed-numbers";

describe("geo codec", () => {
  it("validates good identifier values", () => {
    expect({latitude: 10.4, longitude: -122.22, altitude: 1}).to.conform(geoCodec.specForIdentifier);
    expect({latitude: 90, longitude: 180}).to.conform(geoCodec.specForIdentifier);
    expect({latitude: -90, longitude: -180}).to.conform(geoCodec.specForIdentifier);
    expect([-90, -180]).to.conform(geoCodec.specForIdentifier);
  });

  it("rejects bad identifier values", () => {
    expect({latitude: 0, longitude: 180.1}).to.not.conform(geoCodec.specForIdentifier);
    expect({latitude: 0, longitude: -180.1}).to.not.conform(geoCodec.specForIdentifier);
    expect({latitude: 91, longitude: 0}).to.not.conform(geoCodec.specForIdentifier);
    expect({latitude: -91, longitude: 0}).to.not.conform(geoCodec.specForIdentifier);
    expect([-180, -180]).to.not.conform(geoCodec.specForIdentifier);
    expect("sandwich").to.not.conform(geoCodec.specForIdentifier);
  });

  it("supports encoding", () => {
    const value = {latitude: 20, longitude: 55};
    const actual = geoCodec.encode(value) as Float[];
    expect(actual).has.length(2);
    expect(actual[0]).is.instanceOf(Float);
    expect(actual[1]).is.instanceOf(Float);
    expect(actual.map(f => f.value)).to.contain.ordered.members([value.latitude, value.longitude]);
  });

  it("validates good decoded values", () => {
    expect([20, -43.12]).to.conform(geoCodec.specForDecoding);
    expect([90, 180]).to.conform(geoCodec.specForDecoding);
    expect([-90, -180]).to.conform(geoCodec.specForDecoding);
  });

  it("supports decoding", () => {
    const value = [74.34,-99.123532];
    const actual = geoCodec.decode(value);
    expect(actual).to.deep.equal({latitude: value[0], longitude: value[1]});
  });

  it("generates a debug string", () => {
    const value = {latitude: 1, longitude: 2};
    const actual = geoCodec.toDebugString(value);
    expect(actual).to.equal("lat:1/long:2");
  });
});