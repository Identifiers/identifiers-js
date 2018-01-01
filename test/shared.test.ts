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

  it("deep-freezes arrays of complex objects", () => {
    const array = [{
      a: {
        b: {},
      }
    }];
    const actual = deepFreeze(array);
    expect(actual).to.be.frozen;
    expect(actual[0].a).to.be.frozen;
    expect(actual[0].a.b).to.be.frozen;
  });
});