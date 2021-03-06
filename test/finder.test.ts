import {expect} from "chai";

import {codecSymbol} from "../src/shared";
import {codecForTypeCode, findCodec} from "../src/finder";
import {registerSemanticTypeCode} from "../src/semantic";
import {testCodec} from "./tests-shared";
import {Identifier} from "../src/identifier";


describe("codec finder", () => {
  const baseIdentifier = {
    toDataString: () => "test-toDataString",
    toJSON: (key: string) => "test-toJSON",
    toHumanString: () => "test-toHumanString"
  };

  describe("findCodec()", () => {
    it("throws an error with an identifier that is missing a codec", () => {
      const id: Identifier<string> = {
          ...baseIdentifier,
        type: "string",
        value: "boo"
      };
      expect(() => findCodec(id)).to.throw();
    });

    it("throws an error with an identifier that's codec isn't known by the finder", () => {
      const id: Identifier<string> = {
        ...baseIdentifier,
        type: "string",
        value: "boo",
        [codecSymbol]: {
          typeCode: -1
        }
      };
      expect(() => findCodec(id)).to.throw();
    });

    it("successfully finds a codec on an identifier", () => {
      const id: Identifier<number> = {
        ...baseIdentifier,
        type: "test-positive",
        value: 55,
        [codecSymbol]: testCodec
      };
      expect(() => findCodec(id)).to.not.throw();
    });
  });

  describe("codecForTypeCode()", () => {
    it("throws error if it can't find a codec for a codeType", () => {
      expect(() => codecForTypeCode(-1)).to.throw();
    });

    it("finds a registered codec", () => {
      const actual = codecForTypeCode(testCodec.typeCode);
      expect(actual).to.equal(testCodec);
    });

    it("creates an unknown codec for an unknown semantic type", () => {
      const semanticTypeCode = registerSemanticTypeCode(testCodec.typeCode, 10);
      const actual = codecForTypeCode(semanticTypeCode);
      expect(actual).to.include({
        ...testCodec,
        type: `unknown-${testCodec.type}`,
        typeCode: semanticTypeCode
      });
    });
  });
});