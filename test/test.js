/* eslint no-param-reassign: "off" */
import test from 'ava';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Koa from 'koa';

import router from '../server/routes';

chai.use(chaiHttp);
let koa;
let request;

test.before(() => {
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
