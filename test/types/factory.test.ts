import {expect} from "chai";
import * as Long from "long";
import * as S from "js.spec";

import * as factory from "../../src/types/factory";
import {Identifier, IdentifierCodec} from "../../src/identifier";
import {identifierSpec} from "../../src/shared";
import {anyCodec, stringCodec, booleanCodec, integerCodec, floatCodec, longCodec} from "../../src/types/primitives";


function validateCreatedIdentifier(expectedCodec: IdentifierCodec, expectedValue: any, actualId: Identifier<any>): void {
  expect(S.valid(identifierSpec, actualId)).to.equal(true);
  expect(actualId.value).to.deep.equal(expectedValue);
}

describe("identifier factory", () => {
  it("creates an any identifier", () => {
    const values = ["air", false, 229573.1, null, new Date(), [], {}];
    values.forEach((value) => {
      const actual = factory.forAny(value);
      validateCreatedIdentifier(anyCodec, value, actual);
    });
  });

  it("creates a string identifier", () => {
    const value = "air";
    const actual = factory.forString(value);
    validateCreatedIdentifier(stringCodec, value, actual);
  });

  it("creates a boolean identifier", () => {
    const value = false;
    const actual = factory.forBoolean(value);
    validateCreatedIdentifier(booleanCodec, value, actual);
  });

  it("creates a float identifier", () => {
    const value = 0.65584;
    const actual = factory.forFloat(value);
    validateCreatedIdentifier(floatCodec, value, actual);
  });

  it("creates a integer identifier", () => {
    const value = 99;
    const actual = factory.forInteger(value);
    validateCreatedIdentifier(integerCodec, value, actual);
  });

  it("creates a long(number) identifier", () => {
    const value = 9967574044;
    const actual = factory.forLong(value);
    validateCreatedIdentifier(longCodec, Long.fromInt(value), actual);
  });

  it("creates a long(Long) identifier", () => {
    const value = Long.fromInt(9967574044);
    const actual = factory.forLong(value);
    validateCreatedIdentifier(longCodec, value, actual);
  });

  it("creates a datetime identifier", () => {
    const value = new Date();
    const actual = factory.forDatetime(value);
    validateCreatedIdentifier(longCodec, value, actual);
  });
});