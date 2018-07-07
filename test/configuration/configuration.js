import test from 'ava';
import { expect } from 'chai';
import { ensureDir, pathExists, readJson } from 'fs-extra';

import { privateDir } from '../../server/lib/tools/directory';
import { defaultIdLength, idFactory, safeIdFactory } from '../../server/lib/tools/id';
import Configuration from '../../server/lib/config';
import defaultConfig from '../../server/lib/config/default';
import { getClients } from '../../server/lib/config/clients';

let config;

test.before(async () => {
  await ensureDir(privateDir);
  config = new Configuration();
  await config.getConfig();
});

test(privateDir, async () => ensureDir(privateDir));

test(Configuration.getConfigFileUrl(), async () => {
  expect(await pathExists(Configuration.getConfigFileUrl())).to.equal(true);
});

test('Configuration should be a parseable JSON file', async () => {
  expect(typeof await readJson(Configuration.getConfigFileUrl())).to.equal('object');
});

test('Configuration.getConfig()', async () => {
  const conf = {
    ...defaultConfig,
    ...await readJson(Configuration.getConfigFileUrl()),
  };
  expect(await config.getConfig()).to.deep.equal(conf);
  expect(await config.getConfig()).to.not.equal({});
});

test('Clients', async () => {
  const clients = await getClients();
  expect(Array.isArray(clients)).to.equal(true);
  expect(clients).to.have.lengthOf(0);
});

test(`ID generation should have length ${defaultIdLength} by default`, () => {
  const id = idFactory();
  expect(id).to.have.lengthOf(defaultIdLength);
});

test('ID generation should also only output ID w/ custom length', () => {
  const length = 12;
  const id = idFactory(length);
  expect(id).to.have.lengthOf(length);
});

test('sID generation hould fall back to default length if unsupported length was given', () => {
  const length = 'unsupported';
  const id = idFactory(length);
  expect(id).to.have.lengthOf(defaultIdLength);
});

test(`Safe ID generation should have length ${defaultIdLength} by defauul`, () => {
  const id = safeIdFactory();
  expect(id.length).to.equal(defaultIdLength);
});

test('Safe ID generation should also only output ID w/ custom length', () => {
  const length = 12;
  const id = safeIdFactory(length);
  expect(id).to.have.lengthOf(length);
});

test('Safe ID generation should fall back to default length if unsupported length was given', () => {
  const length = 'unsupported';
  const id = safeIdFactory(length);
  expect(id).to.have.lengthOf(defaultIdLength);
});
