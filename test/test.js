/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: [ "off", { "allowNamedFunctions": true } ] */
/* eslint func-names: ["off", "always"] */
import chai from 'chai';
import chaiHttp from 'chai-http';

import { start } from '../server';

chai.use(chaiHttp);

describe('Server', function () {
  before(async function () {
    this.app = await start();
    this.request = chai.request(this.app);
  });
  describe('Koa', function () {
    it('should return HTTP Status 302 on /', async function () {
      const res = await this.request.get('/');
      chai.expect(res).to.have.status(302);
    });
  });
});
