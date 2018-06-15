/* eslint import/no-named-default: "off" */
import test from 'ava';
import { expect } from 'chai';

import { default as keyFactory, maxLength } from '../../server/lib/tools/cookie';

let keys;

test.before(() => {
  keys = keyFactory();
});

test(`Keys should have default length ${maxLength}`, () => {
  expect(keys).to.have.lengthOf(maxLength);
});

test('Each key should have length of 16', () => {
  const tested = keys.filter(k => k.length === 16);
  expect(tested).to.have.lengthOf(maxLength);
});
