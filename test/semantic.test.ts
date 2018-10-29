import {expect} from "chai";

import {registerSemanticTypeCode, SEMANTIC_SLOT_SHIFT, SEMANTIC_TYPE_FLAG} from "../src/semantic";

describe("semantic typeCode", () => {
  it("calculates correct semantic values", () => {
    const baseTypeCode = 1;
    const slot = 256;
    const actual = registerSemanticTypeCode(baseTypeCode, slot);
    expect(actual).to.equal(baseTypeCode + SEMANTIC_TYPE_FLAG + (slot << SEMANTIC_SLOT_SHIFT));
  });

  it("does not allow multiple semantic values in the same slot", () => {
    registerSemanticTypeCode(4, 257);
    expect(() => registerSemanticTypeCode(5, 257)).to.throw();
  });
});