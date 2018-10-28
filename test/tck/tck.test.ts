import * as chai from "chai";
const expect = chai.expect;

import * as ID from "../../src";
import * as Long from "long";
import {long} from "../../src/types-export";
const codecSymbol = Symbol.for("id-codec");


describe("TCK tests", () => {
  describe("primitives", () => {
    it("supports string", () => {
      const tck = require("spec/tck/files/primitives/string.json");
      testTck(tck);
    });

    it("supports boolean", () => {
      const tck = require("spec/tck/files/primitives/boolean.json");
      testTck(tck);
    });

    it("supports integer", () => {
      const tck = require("spec/tck/files/primitives/integer.json");
      testTck(tck);
    });

    it("supports float", () => {
      const tck = require("spec/tck/files/primitives/float.json");
      testTck(tck);
    });

    it("supports long", () => {
      const tck = require("spec/tck/files/primitives/long.json");
      function testLongValue(idValue: any, testValue: any) {
        if (Long.isLong(idValue)) {
          expect(idValue.toString()).to.equal(testValue);
          return;
        }
        if (Array.isArray(idValue)) {
          const idList = idValue.map(value => value.toString());
          expect(idList).to.deep.equal(testValue);
          return;
        }
        // assume map
        const idMap = Object.keys(idValue).reduce(
            (acc, key) => ({...acc, [key]: idValue[key].toString()}), {});
      }

      testTck(tck, testLongValue);
    });

    it("supports bytes", () => {
      const tck = require("spec/tck/files/primitives/bytes.json");
      testTck(tck);
    });
  });

  describe("semantic", () => {
    it("supports uuid", () => {
      const tck = require("spec/tck/files/semantic/uuid.json");
      testTck(tck);
    });

    it("supports datetime", () => {
      const tck = require("spec/tck/files/semantic/datetime.json");
      testTck(tck);
    });

    it("supports geo", () => {
      const tck = require("spec/tck/files/semantic/geo.json");
      testTck(tck);
    });
  });

  describe("composite", () => {
    function jsonifyID(id: any) {
      let value: string;
      if (id.type.startsWith("long")) {
        value = id.value.toString();
      } else {
        value = JSON.stringify(id.value);
      }
      return {type: id.type, value};
    }

    it("supports list", () => {
      function testListValue(idValue: any[], testValue: any[]): void {
        const actual = idValue.map(jsonifyID);
        const expected = testValue.map(jsonifyID);
        expect(actual).to.deep.equal(expected);
      }

      const tck = require("spec/tck/files/composites/list.json");
      testTck(tck, testListValue);
    });

    it("supports map", () => {
      function jsonifyMapID(id: any) {
        return Object.keys(id).reduce(
            (acc, key) => ({...acc, [key]: jsonifyID(id[key])}), {});
      }

      function testMapValue(idValue: any, testValue: any): void {
        const actual = jsonifyMapID(idValue);
        const expected = jsonifyMapID(testValue);
        expect(actual).to.deep.equal(expected);
      }

      const tck = require("spec/tck/files/composites/map.json");
      testTck(tck, testMapValue);
    });
  });
});


interface TCK {
  typeCode: number;
  type: string;
  value: any;
  data: string;
  human: string;
  mixedHuman: string;
}

function testTck(tck: TCK[], valueExpectation?: (idValue: any, testValue: any) => void): void {
  function testValue(idValue: any, testValue: any) {
    // JSON.stringify strips out the functions so we can just compare values.
    expect(JSON.stringify(idValue)).to.equal(JSON.stringify(testValue));
  }

  tck.forEach(test => {
    roundTripTest(test, valueExpectation || testValue);
    roundTripTest(test, valueExpectation || testValue, true);
  });
}

function roundTripTest(test: TCK,
                       valueExpectation: (idValue: any, testValue: any) => void,
                       isHuman?: boolean): void {

  const encoded = isHuman ? test.mixedHuman : test.data;
  const id = ID.decodeFromString(encoded);
  expect(id.type).to.equal(test.type);

  valueExpectation(id.value, test.value);

  if (isHuman) {
    const toString = id.toHumanString();
    expect(toString).to.equal(test.human);
  } else {
    const toString = id.toDataString();
    expect(toString).to.equal(encoded);
  }

  // @ts-ignore: codec not part of identifier interface
  const codec = id[codecSymbol];
  expect(codec.typeCode).to.equal(test.typeCode);
}