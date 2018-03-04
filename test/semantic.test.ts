import {expect} from "chai";

import {calculateSemanticTypeCode} from "../src/semantic";

describe("semantic typeCode", () => {
  it("calculates correct semantic values", () => {
    const baseTypeCode = 1;
    const slot = 254;
    const actual = calculateSemanticTypeCode(baseTypeCode, slot);
    expect(actual).to.equal(baseTypeCode + 128 + (slot << 8));
  });

  it("does not allow multiple semantic values in the same slot", () => {
    calculateSemanticTypeCode(4, 256);
    expect(() => calculateSemanticTypeCode(5, 256)).to.throw();
  });
});