import {expect} from "chai";
import {factory} from "../../src";
import {mapCodec} from "../../src/types/composite";

describe("composite-map codec", () => {
  it("correctly encodes a map with different-ordered keys", () => {
    const value = {b: factory.string("there"), a: factory.boolean(true)};
    const id = mapCodec.forIdentifier(value);
    const actual = mapCodec.encode(id);

    expect(Object.keys(actual)).to.have.ordered.members(["a", "b"]);
  });
});