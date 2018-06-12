/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: [ "off", { "allowNamedFunctions": true } ] */
/* eslint func-names: ["off", "always"] */
import chai from 'chai';
import http from 'chai-http';
import { Nuxt, Builder } from 'nuxt';

import config from '../../nuxt.config';

chai.use(http);

describe('Nuxt.js', function () {
  this.timeout(15000);
  before(async function () {
    this.nuxt = new Nuxt(config);
    await new Builder(this.nuxt).build();
    this.nuxt.listen(49935, '127.0.0.1');
    this.request = chai.request('http://127.0.0.1:49935').keepOpen();
  });

  after(async function () {
    this.request.close();
    this.nuxt.close();
  });

  describe('Application', function () {
    it('should resolve /web/login as HTML', async function () {
      const res = await this.request.get('/web/login');
      chai.expect(res).to.have.status(200);
      chai.expect(res.type).to.equal('text/html');
    });
  });
});
