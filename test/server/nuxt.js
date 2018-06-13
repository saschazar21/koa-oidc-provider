import test from 'ava';
import chai from 'chai';
import http from 'chai-http';
import { Nuxt, Builder } from 'nuxt';

import config from '../../nuxt.config';

chai.use(http);

let app;
let nuxt;
let request;

test.before(async () => {
  nuxt = new Nuxt(config);
  await new Builder(nuxt).build();
  app = nuxt.render.listen();
  request = chai.request(app).keepOpen();
});

test.after(async () => {
  request.close();
  app.close();
  nuxt.close();
});

test('Application should resolve /web/login as HTML', async () => {
  const res = await request.get('/web/login');
  chai.expect(res).to.have.status(200);
  chai.expect(res.type).to.equal('text/html');
});
