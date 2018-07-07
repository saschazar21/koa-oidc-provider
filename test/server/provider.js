import dotenv from 'dotenv';
import test from 'ava';
import chai from 'chai';
import http from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import Koa from 'koa';
import mount from 'koa-mount';

import Configuration from '../../server/lib/config';
import bootstrapProvider from '../../server/provider';
import { getBaseClient } from '../../server/lib/config/clients';

chai.use(http);
chai.use(chaiAsPromised);
dotenv.config();

let config;
let app;
let provider;
let request;

test.before(async () => {
  provider = await bootstrapProvider();

  const koa = new Koa();
  config = new Configuration();
  koa.use(mount(provider.app));
  app = koa.listen();
  request = chai.request(app).keepOpen();
}, 15000);

test.after(async () => {
  request.close();
  app.close();
});

test('Provider should provide a route for /.well-known/openid-configuration', async () => {
  const res = await request.get('/.well-known/openid-configuration');
  chai.expect(res).to.have.status(200);
  chai.expect(res).to.have.header('content-type');
  chai.expect(res.type).to.equal('application/json');
});

test('Provider should provide a route for JWKs', async () => {
  const conf = await config.getConfig();
  const url = conf.routes && conf.routes.certificates ? conf.routes.certificates : '/certs';
  const res = await request.get(url);
  chai.expect(res).to.have.status(200);
  chai.expect(res).to.have.header('content-type');
  chai.expect(res.type).to.equal('application/json');
});

test('Provider should contain base client', async () => {
  const baseClient = await getBaseClient();
  const realClient = await provider.Client.find(baseClient.client_id);
  chai.expect(baseClient.client_id).to.equal(realClient.clientId);
});
