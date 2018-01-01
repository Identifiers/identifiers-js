import {expect} from "chai";
import * as Long from "long";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";

import {factory} from "../src";
import {Identifier} from "../src/identifier";
import {identifierSpec} from "./tests-shared";
import {LongLike} from "../src/types/long";
import {createImmutableDate} from "../src/types/immutable-date";

chai.use(jsSpecChai);


function validateCreatedIdentifier(expectedValue: any, actualId: Identifier<any>, comparator?: (exected, actual) => boolean): void {
  expect(actualId).to.be.frozen.and.conform(identifierSpec);
  if (comparator) {
    expect(comparator(expectedValue, actualId.value)).to.be.true;
  } else {
    expect(actualId.value).to.deep.equal(expectedValue);
  }
}

describe("identifier factory methods", () => {

  describe("any", () => {
    it("creates an identifier", () => {
      const values = ["air", false, -443, 229573.1];
      values.forEach((value) => {
        const actual = factory.any(value);
        validateCreatedIdentifier(value, actual);
      });
    });

    it("creates a list identifier", () => {
      const values = ["air", false, -443, 229573.1];
      const actual = factory.any.list(...values);
      validateCreatedIdentifier(values, actual);
    });
  });

  describe("string", () => {
    it("creates an identifier", () => {
      const value = "air";
      const actual = factory.string(value);
      validateCreatedIdentifier(value, actual);
    });

    it("creates a list identifier", () => {
      const v1 = "happy";
      const v2 = "dance";
      const actual = factory.string.list(v1, v2);
      validateCreatedIdentifier([v1, v2], actual);
    });
  });

  describe("boolean", () => {
    it("creates an identifier", () => {
      const value = false;
      const actual = factory.boolean(value);
      validateCreatedIdentifier(value, actual);
    });

    it("creates a list identifier", () => {
      const v1 = true;
      const v2 = false;
      const actual = factory.boolean.list(v1, v2);
      validateCreatedIdentifier([v1, v2], actual);
    });
  });

  describe("float", () => {
    it("creates an identifier", () => {
      const value = 0.65584;
      const actual = factory.float(value);
      validateCreatedIdentifier(value, actual);
    });

    it("creates a list identifier", () => {
      const v1 = 8685.34;
      const v2 = -3;
      const actual = factory.float.list(v1, v2);
      validateCreatedIdentifier([v1, v2], actual);
    });
  });

  describe("integer", () => {
    it("creates an identifier", () => {
      const value = 99;
      const actual = factory.integer(value);
      validateCreatedIdentifier(value, actual);
    });

    it("creates a list identifier", () => {
      const v1 = -9;
      const v2 = 32325;
      const actual = factory.integer.list(v1, v2);
      validateCreatedIdentifier([v1, v2], actual);
    });
  });

  describe("long", () => {
    it("creates an identifier from a number", () => {
      const value = 9967574044;
      const actual = factory.long(value);
      const long = Long.fromNumber(value);
      validateCreatedIdentifier({low: long.low, high: long.high}, actual);
    });

    it("creates an identifier from a Long", () => {
      const value = Long.fromNumber(19404);
      const actual = factory.long(value);
      validateCreatedIdentifier({low: value.low, high: value.high}, actual);
    });

    it("rejects a Long that is unsigned", () => {
      const value = Long.fromNumber(19404, true);
      expect(() => factory.long(value)).to.throw();
    });

    it("creates a list identifier from numbers", () => {
      const v1 = 9967574044;
      const v2 = -945;
      const actual = factory.long.list(v1, v2);
      const l1 = Long.fromNumber(v1);
      const l2 = Long.fromNumber(v2);
      validateCreatedIdentifier([
        {low: l1.low, high: l1.high},
        {low: l2.low, high: l2.high}
      ], actual);
    });

    it("creates a list identifier from Longs", () => {
      const l1 = Long.fromNumber(-276534);
      const l2 = Long.fromNumber(15);
      const actual: Identifier<LongLike[]> = factory.long.list(l1, l2);
      validateCreatedIdentifier([
        {low: l1.low, high: l1.high},
        {low: l2.low, high: l2.high}
      ], actual);
    });

    it("creates a list identifier from both number and Long", () => {
      const l1 = Long.fromNumber(764739633);
      const v2 = -685849345;
      const actual: Identifier<LongLike[]> = factory.long.list(l1, v2);
      const l2 = Long.fromNumber(v2);
      validateCreatedIdentifier([
        {low: l1.low, high: l1.high},
        {low: l2.low, high: l2.high}
      ], actual);
    });
  });

  describe("datetime", () => {
    const compareImmutableDates = (expected, actual) => expected.time === actual.time;

    it("creates an identifier from a number", () => {
      const value = new Date().getTime();
      const actual = factory.datetime(value);
      validateCreatedIdentifier(createImmutableDate(value), actual, compareImmutableDates);
    });

    it("creates an identifier from a Date", () => {
      const value = new Date();
      const actual = factory.datetime(value);
      validateCreatedIdentifier(createImmutableDate(value), actual, compareImmutableDates);
    });

    const compareImmutableDateList = (idList, decodedList) => {
      const l1 = idList.map(id => id.time);
      const l2 = decodedList.map(id => id.time);
      return l1.filter(t => l2.indexOf(t) < 0).length === 0;
    };

    it("creates a date-list identifier from numbers", () => {
      const v1 = createImmutableDate(new Date());
      const v2 = createImmutableDate(new Date(v1.time + 1));
      const actual = factory.datetime.list(v1.time, v2.time);
      validateCreatedIdentifier([v1, v2], actual, compareImmutableDateList);
    });

    it("creates a date-list identifier from Dates", () => {
      const v1 = new Date();
      const v2 = new Date(v1.getTime() + 1);
      const actual = factory.datetime.list(v1, v2);
      const expected = [v1, v2].map(createImmutableDate);
      validateCreatedIdentifier(expected, actual, compareImmutableDateList);
    });

    it("creates a list identifier from both number and Date", () => {
      const v1 = new Date();
      const v2 = new Date().getTime() + 1;
      const actual = factory.datetime.list(v1, v2);
      const expected = [v1, v2].map(createImmutableDate);
      validateCreatedIdentifier(expected, actual, compareImmutableDateList);
    });
  });
});