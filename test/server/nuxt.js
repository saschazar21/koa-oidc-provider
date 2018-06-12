/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: [ "off", { "allowNamedFunctions": true } ] */
/* eslint func-names: ["off", "always"] */
import chai from 'chai';
import http from 'chai-http';
import { Nuxt, Builder } from 'nuxt';

import config from '../../nuxt.config';

chai.use(http);
const PORT = 49935;

// TODO: Unskip test
describe.skip('Nuxt.js', function () {
  this.timeout(15000);
  before(async function () {
    this.nuxt = new Nuxt(config);
    await new Builder(this.nuxt).build();
    await this.nuxt.listen(PORT, 'localhost');
    this.request = chai.request(`http://localhost:${PORT}`).keepOpen();
  });

  after(async function () {
    this.request.close();
    return this.nuxt.close();
  });

  describe('Application', function () {
    it('should resolve /web/login as HTML', async function () {
      const res = await this.request.get('/web/login');
      chai.expect(res).to.have.status(200);
      chai.expect(res.type).to.equal('text/html');
    });
  });
});
