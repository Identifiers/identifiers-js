const chai = require('chai');
const expect = chai.expect;

const IDs = require('../../lib');

const codecSymbol = Symbol.for('id-codec');



describe('TCK tests', () => {
  describe('primitives', () => {
    it('supports string', () => {
      const tck = require('identifiers-spec/tck/files/primitives/string.json');
      testTck(tck);
    });

    it('supports boolean', () => {
      const tck = require('identifiers-spec/tck/files/primitives/boolean.json');
      testTck(tck);
    });

    it('supports integer', () => {
      const tck = require('identifiers-spec/tck/files/primitives/integer.json');
      testTck(tck);
    });

    it('supports float', () => {
      const tck = require('identifiers-spec/tck/files/primitives/float.json');
      testTck(tck);
    });

    it('supports long', () => {
      const tck = require('identifiers-spec/tck/files/primitives/long.json');
      testTck(tck);
    });

    it('supports bytes', () => {
      const tck = require('identifiers-spec/tck/files/primitives/bytes.json');
      testTck(tck);
    });
  });

  describe('semantic', () => {
    it('supports uuid', () => {
      const tck = require('identifiers-spec/tck/files/semantic/uuid.json');
      testTck(tck);
    });

    it('supports datetime', () => {
      const tck = require('identifiers-spec/tck/files/semantic/datetime.json');
      testTck(tck);
    });

    it('supports geo', () => {
      const tck = require('identifiers-spec/tck/files/semantic/geo.json');
      testTck(tck);
    });
  });
});


function testTck(tck) {
  tck.forEach(test => {
    roundTripTest(test, test.base128);
    roundTripTest(test, test.base32, true);
  });
}

function roundTripTest(test, encoded, isBase32) {
  const id = IDs.decodeFromString(encoded);
  expect(id.type).to.equal(test.type);
  // JSON.stringify strips out the functions so we can just compare values.
  expect(JSON.stringify(id.value)).to.equal(JSON.stringify(test.value));
  const toString = isBase32 ? id.toBase32String() : id.toString();
  expect(toString).to.equal(encoded);

  const codec = id[codecSymbol];
  expect(codec.typeCode).to.equal(test.typeCode);
}