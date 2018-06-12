/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: [ "off", { "allowNamedFunctions": true } ] */
/* eslint func-names: ["off", "always"] */
import chai from 'chai';
import chaiHttp from 'chai-http';
import Koa from 'koa';

import router from '../server/routes';

chai.use(chaiHttp);

describe('Server', function () {
  before(async function () {
    const koa = new Koa();
    koa.use(router.routes());
    this.app = koa.listen();
    this.request = chai.request(this.app).keepOpen();
  });

  after(async function () {
    this.request.close();
    this.app.close();
  });

  describe('Base', function () {
    it('should redirect to /web', async function () {
      const res = await this.request.get('/');
      return chai.expect(res).to.redirect;
    });
  });
});
