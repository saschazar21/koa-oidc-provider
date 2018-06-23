import test from 'ava';
import { expect } from 'chai';

import { compareHash, passwordHash } from '../../server/lib/tools/password';
import { safeIdFactory } from '../../server/lib/tools/id';

let password;
let hash;

let password2;
let hash2;

test.serial('should create a password hash', async () => {
  password = safeIdFactory();
  hash = await passwordHash(password);
  expect(typeof hash).to.equal('string');
  return expect(hash).to.have.length > 0;
});

test.serial('should return true for password/hash compare', async () => {
  expect(await compareHash(password, hash)).to.equal(true);
});

test.serial('should create a second password hash', async () => {
  password2 = safeIdFactory();
  hash2 = await passwordHash(password2);
  expect(typeof hash).to.equal('string');
  return expect(hash).to.have.length > 0;
});

test.serial('should return false for incorrect password/hash compare', async () => {
  expect(await compareHash(password2, hash)).to.equal(false);
  expect(await compareHash(password, hash2)).to.equal(false);
  expect(await compareHash(password2, hash2)).to.equal(true);
});
