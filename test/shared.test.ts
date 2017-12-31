import {expect} from "chai";
import {deepFreeze} from "../src/shared";

describe("deep freeze", () => {
  it("deep-freezes complex objects", () => {
    const obj = {
      a: {
        b: {},
      }
    };
    const actual = deepFreeze(obj);
    expect(actual).to.be.frozen;
    expect(actual.a).to.be.frozen;
    expect(actual.a.b).to.be.frozen;
  });
});