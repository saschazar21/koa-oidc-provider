/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: [ "off", { "allowNamedFunctions": true } ] */
/* eslint func-names: ["off", "always"] */
import chai from 'chai';
import chaiHttp from 'chai-http';

import Configuration from '../server/lib/config';
import { start } from '../server';

chai.use(chaiHttp);

describe('Server', function () {
  this.timeout(15000);

  before(async function () {
    this.config = new Configuration();
    this.app = await start();
    this.request = chai.request(this.app).keepOpen();
  });

  after(async function () {
    this.request.close();
  });

  describe('Base', function () {
    it('should redirect to /web', async function () {
      const res = await this.request.get('/');
      return chai.expect(res).to.redirect;
    });
  });

  describe('OIDC Provider', function () {
    it('should provide a route for /.well-known/openid-configuration', async function () {
      const res = await this.request.get('/.well-known/openid-configuration');
      chai.expect(res).to.have.status(200);
      chai.expect(res).to.have.header('content-type');
      chai.expect(res.type).to.equal('application/json');
    });

    it('should provide a route for JWKs', async function () {
      const config = await this.config.getConfig();
      const url = config.routes && config.routes.certificates ? config.routes.certificates : '/certs';
      const res = await this.request.get(url);
      chai.expect(res).to.have.status(200);
      chai.expect(res).to.have.header('content-type');
      chai.expect(res.type).to.equal('application/json');
    });
  });
});
