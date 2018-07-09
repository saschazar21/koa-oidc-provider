/* eslint no-param-reassign: "off" */
import dotenv from 'dotenv';
import test from 'ava';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Koa from 'koa';

import bootstrapRoutes from '../server/routes';

dotenv.config();
chai.use(chaiHttp);

let koa;
let request;

test.before(async () => {
  const router = await bootstrapRoutes(null);
  const k = new Koa();
  k.use(router.routes());
  koa = k.listen();
  request = chai.request(koa).keepOpen();
}, 15000);

test.after(async () => {
  await koa.close();
  await request.close();
});

test('Server should redirect to /web', async () => {
  const res = await request.get('/');
  return chai.expect(res).to.redirect;
});
