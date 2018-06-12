/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: [ "off", { "allowNamedFunctions": true } ] */
/* eslint func-names: ["off", "always"] */
import chai from 'chai';
import http from 'chai-http';
import Koa from 'koa';
import mount from 'koa-mount';

import Configuration from '../../server/lib/config';
import bootstrapProvider from '../../server/provider';

chai.use(http);

describe('OpenID Connect', function () {
  this.timeout(15000);
  before(async function () {
    this.provider = await bootstrapProvider();

    const koa = new Koa();
    this.config = new Configuration();
    koa.use(mount(this.provider));
    this.app = koa.listen();
    this.request = chai.request(this.app).keepOpen();
  });

  describe('Provider', function () {
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

  after(async function () {
    this.request.close();
    this.app.close();
  });
});
