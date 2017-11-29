import {expect} from "chai";
import * as Long from "long";

import * as factory from "../../src/types/factory";
import {Identifier, IdentifierCodec} from "../../src/identifier";
import {longCodec} from "../../src/types/long";

import * as chai from "chai";
import jsSpecChai from "js.spec-chai";
import {anyCodec} from "../../src/types/any";
import {booleanCodec} from "../../src/types/boolean";
import {stringCodec} from "../../src/types/string";
import {integerCodec} from "../../src/types/integer";
import {floatCodec} from "../../src/types/float";
import {identifierSpec} from "../test-shared";

chai.use(jsSpecChai);


function validateCreatedIdentifier(codec: IdentifierCodec, value: any, actualId: Identifier<any>): void {
  expect(actualId).to.conform(identifierSpec);
  expect(actualId.value).to.deep.equal(value);
}

describe("identifier factory", () => {
  it("creates an any identifier", () => {
    const values = ["air", false, 229573.1];
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


  it("creates an integer identifier", () => {
    const value = 99;
    const actual = factory.forInteger(value);
    validateCreatedIdentifier(integerCodec, value, actual);
  });


  it("creates a long (from number) identifier", () => {
    const value = 9967574044;
    const long = Long.fromNumber(value);
    const actual = factory.forLong(value);
    validateCreatedIdentifier(longCodec, {low: long.low, high: long.high}, actual);
  });

  it("creates a long (from  Long) identifier", () => {
    const value = Long.fromNumber(9967574044);
    const actual = factory.forLong(value);
    validateCreatedIdentifier(longCodec, value, actual);
  });


  it("creates a datetime (from number) identifier", () => {
    const value = new Date();
    const actual = factory.forDatetime(value.getTime());
    validateCreatedIdentifier(longCodec, value, actual);
  });

  it("creates a datetime (from Date) identifier", () => {
    const value = new Date();
    const actual = factory.forDatetime(value);
    validateCreatedIdentifier(longCodec, value, actual);
  });
});