import test from 'ava';
import chai from 'chai';
import http from 'chai-http';
import Koa from 'koa';
import mount from 'koa-mount';

import Configuration from '../../server/lib/config';
import bootstrapProvider from '../../server/provider';

chai.use(http);

let config;
let app;
let request;

test.before(async () => {
  const provider = await bootstrapProvider();

  const koa = new Koa();
  config = new Configuration();
  koa.use(mount(provider));
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
