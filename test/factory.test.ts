import {expect} from "chai";
import * as Long from "long";
import * as chai from "chai";
import jsSpecChai from "js.spec-chai";

import {factory} from "../src";
import {Identifier} from "../src/identifier";
import {identifierSpec, testCodec} from "./tests-shared";
import {LongLike} from "../src/types/long";
import {ImmutableDate} from "../src/types/immutable-date";
import {createIdentifier} from "../src/factory";
import {UuidLike} from "../src/types/uuid";
import {TypedObject} from "../src/shared";

chai.use(jsSpecChai);


describe("createIdentifier method", () => {
  it("creates an identifier with the correct shape", () => {
    const value = 3;
    const actual = createIdentifier(testCodec, value);
    expect(actual).to.conform(identifierSpec);
    expect(actual).to.include({type: testCodec.type, value: value});
    expect(actual.toString()).to.equal("ID«test-type»3");
  });
});

describe("identifier factory methods", () => {

  const nestedMapExpectation = (nestedExpected: object, actual: object) => {
    expect(actual).to.nested.include(nestedExpected);
  };

  function validateCreatedIdentifier(
      expectedValue: any,
      actualId: Identifier<any>,
      expectation?: (expected: any, actual: any) => void): void {
console.log(actualId.toString(), '\n');
    expect(actualId).to.be.frozen.and.conform(identifierSpec);
    if (expectation) {
      expectation(expectedValue, actualId.value);
    } else {
      expect(actualId.value).to.deep.equal(expectedValue);
    }
  }

  describe("list value", () => {
    it("consumes an array as a factory value (instead of spread values)", () => {
      const values = ["a", "b"];
      const actual = factory.string.list(values);
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

    it("creates a map identifier", () => {
      const v1 = "happy";
      const v2 = "dance";
      const expected = {b: v1, a: v2};
      const actual = factory.string.map(expected);
      validateCreatedIdentifier(expected, actual);
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

    it("creates a map identifier", () => {
      const v1 = true;
      const v2 = false;
      const expected = {b: v1, a: v2};
      const actual = factory.boolean.map(expected);
      validateCreatedIdentifier(expected, actual);
    });
  });

  describe("integer", () => {
    it("creates an identifier", () => {
      const value = 99;
      const actual = factory.integer(value);
      actual.toString();
      validateCreatedIdentifier(value, actual);
    });

    it("creates a list identifier", () => {
      const v1 = -9;
      const v2 = 32325;
      const actual = factory.integer.list(v1, v2);
      validateCreatedIdentifier([v1, v2], actual);
    });

    it("creates a map identifier", () => {
      const v1 = -9;
      const v2 = 32325;
      const expected = {b: v1, a: v2};
      const actual = factory.integer.map(expected);
      validateCreatedIdentifier(expected, actual);
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

    it("creates a map identifier", () => {
      const v1 = 8685.34;
      const v2 = -3.0;
      const expected = {b: v1, a: v2};
      const actual = factory.float.map(expected);
      validateCreatedIdentifier(expected, actual);
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

    it("creates a map identifier", () => {
      const l1 = Long.fromNumber(764739633);
      const v2 = -685849345;
      const l2 = Long.fromNumber(v2);
      const values = {b: l1, a: v2};
      const expected = {
        b: {low: l1.low, high: l1.high},
        a: {low: l2.low, high: l2.high}
      };
      const actual = factory.long.map(values);
      validateCreatedIdentifier(expected, actual);
    });
  });

  describe("bytes", () => {
    it("creates an identifier from an array of numbers", () => {
      const value = [1, 2, 3];
      const actual = factory.bytes(value);
      validateCreatedIdentifier(value, actual);
    });

    it("creates an identifier from a TypedArray", () => {
      const value = Uint8ClampedArray.of(1, 2, 3);
      const actual = factory.bytes(value);
      validateCreatedIdentifier(Array.from(value), actual);
    });

    it("creates an identifier from an ArrayBuffer", () => {
      const value = Uint8Array.of(1, 2, 3);
      const actual = factory.bytes(value.buffer);
      validateCreatedIdentifier(Array.from(value), actual);
    });

    it("creates a list identifier", () => {
      const v1 = [1, 2, 3];
      const v2 = Uint8ClampedArray.of(1, 2, 3);
      const v3 = Uint8Array.of(1, 2, 3);
      const actual = factory.bytes.list(v1, v2, v3);
      validateCreatedIdentifier([v1, Array.from(v2), Array.from(v3)], actual);
    });

    it("creates a map identifier", () => {
      const v1 = [1, 2, 3];
      const v2 = Uint8ClampedArray.of(1, 2, 3);
      const v3 = Uint8Array.of(1, 2, 3);
      const actual = factory.bytes.map({a: v1, c: v2, b: v3});
      validateCreatedIdentifier({a: v1, b: Array.from(v3), c: Array.from(v2)}, actual);
    });
  });

  describe("composite", () => {
    it("creates a composite list identifier", () => {
      const id1 = factory.integer(3);
      const id2 = factory.string("mac");
      const actual = factory.composite.list(id1, id2);
      actual.toString();
      validateCreatedIdentifier([id1, id2], actual);
    });

    it("creates a composite map identifier", () => {
      const id1 = factory.boolean(true);
      const id2 = factory.datetime(5758484765);
      const idMap = {a: id1, b: id2};
      const actual = factory.composite.map(idMap);
      validateCreatedIdentifier(idMap, actual);
    });
  });

  describe("uuid", () => {
    const uuidExpectation = (expected: number[], actual: UuidLike) => {
      expect(actual.bytes).to.contain.ordered.members(expected);
    };

    it("creates an identifier from a string", () => {
      const uuid = "2836331d-f11f-4dad-b3c0-8522a368ac33";
      const actual = factory.uuid(uuid);
      const expected = [40, 54, 51, 29, 241, 31, 77, 173, 179, 192, 133, 34, 163, 104, 172, 51];
      validateCreatedIdentifier(expected, actual, uuidExpectation);
    });

    it("creates an identifier from an array", () => {
      const uuid = [22, 0, 231, 77, 59, 3, 43, 127, 83, 208, 155, 32, 78, 229, 190, 3];
      const actual = factory.uuid(uuid);
      validateCreatedIdentifier(uuid, actual, uuidExpectation);
    });

    const uuidListExpectation = (expected: number[][], actual: UuidLike[]) => {
      for (let i = 0; i < expected.length; i++) {
        uuidExpectation(expected[i], actual[i]);
      }
    };

    it("creates an identifier list", () => {
      const u1 = "2836331d-f11f-4dad-b3c0-8522a368ac33";
      const u2 = [22, 0, 231, 77, 59, 3, 43, 127, 83, 208, 155, 32, 78, 229, 190, 3];
      const u1a = [40, 54, 51, 29, 241, 31, 77, 173, 179, 192, 133, 34, 163, 104, 172, 51];
      const actual = factory.uuid.list(u1, u2);
      validateCreatedIdentifier([u1a, u2], actual, uuidListExpectation);
    });

    const uuidMapExpectation = (expected: TypedObject<number[]>, actual: TypedObject<UuidLike>) => {
      const expectedKeys = Object.keys(expected);
      const actualKeys = Object.keys(actual);
      expect(actualKeys).contains.ordered.members(expectedKeys);

      const expectedBytes = expectedKeys.map((k) => expected[k]);
      const actualBytes = actualKeys.map((k) => actual[k].bytes);
      expect(actualBytes).to.deep.equal(expectedBytes);
    };

    it("creates an identifier map", () => {
      const u1 = "2836331d-f11f-4dad-b3c0-8522a368ac33";
      const u2 = [22, 0, 231, 77, 59, 3, 43, 127, 83, 208, 155, 32, 78, 229, 190, 3];
      const u1a = [40, 54, 51, 29, 241, 31, 77, 173, 179, 192, 133, 34, 163, 104, 172, 51];
      const actual = factory.uuid.map({c: u1, a: u2});
      const expected = {
        a: u2,
        c: u1a
      };
      validateCreatedIdentifier(expected, actual, uuidMapExpectation);
    });
  });

  describe("datetime", () => {
    const immutableDateExpectation = (expected: number, actual: ImmutableDate) => expected === actual.time;

    it("creates an identifier from a number", () => {
      const value = new Date().getTime();
      const actual = factory.datetime(value);
      validateCreatedIdentifier(value, actual, immutableDateExpectation);
    });

    it("creates an identifier from a Date", () => {
      const value = new Date();
      const actual = factory.datetime(value);
      validateCreatedIdentifier(value, actual, immutableDateExpectation);
    });

    const immutableDateListExpectation = (expected: number[], actual: ImmutableDate[]) => {
      const l2 = actual.map((id) => id.time);
      expect(expected).to.contain.ordered.members(l2);
    };

    it("creates a list identifier", () => {
      const v1 = new Date();
      const v2 = new Date().getTime() + 1;
      const actual = factory.datetime.list(v1, v2);
      const expected = [v1.getTime(), v2];
      validateCreatedIdentifier(expected, actual, immutableDateListExpectation);
    });

    it("creates a map identifier", () => {
      const v1 = new Date();
      const v2 = new Date().getTime() + 1;
      const actual = factory.datetime.map({a: v1, b: v2});
      const nestedExpected = {
        "a.time": v1.getTime(),
        "b.time": v2
      };
      validateCreatedIdentifier(nestedExpected, actual, nestedMapExpectation);
    });
  });

  describe("geo", () => {
    it("creates identifier from input", () => {
      const value = {latitude: 1, longitude: -44};
      const actual = factory.geo(value);
      validateCreatedIdentifier(value, actual);
    });

    it("creates list identifier", () => {
      const v1 = {latitude: 66.4, longitude: 0.994};
      const v2 = {latitude: 1.2234, longitude: -80.14};
      const actual = factory.geo.list(v1, v2);
      validateCreatedIdentifier([v1, v2], actual);
    });

    it("creates map identifier", () => {
      const v1 = {latitude: 66.4, longitude: 0.994};
      const v2 = {latitude: 1.2234, longitude: -80.14};
      const expected = {t: v1, z: v2};
      const actual = factory.geo.map(expected);
      validateCreatedIdentifier(expected, actual);
    });
  });
});