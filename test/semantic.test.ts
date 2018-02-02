import {expect} from "chai";

import {calculateSemanticTypeCode} from "../src/semantic";

describe("semantic typeCode", () => {
  it("calculates correct semantic values", () => {
    const actual = calculateSemanticTypeCode(1, 2);
    expect(actual).to.equal(1 + 128 + (2 << 8));
  });

  it("does not allow duplicate semantic values in the same slot", () => {
    calculateSemanticTypeCode(4, 256);
    expect(() => calculateSemanticTypeCode(5, 256)).to.throw();
  });
});