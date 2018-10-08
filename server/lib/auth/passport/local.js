import passport from 'koa-passport';

import AbstractPassport from './abstract';
import LocalProvider from '../clients/local';

export default class LocalPassport extends AbstractPassport {
  constructor(pass) {
    super(LocalProvider, pass || passport);
    this.params = {
      ...super.params,
      scope: 'openid profile token client client:create client:delete client:edit token',
    };
  }

  async init() {
    return super.init();
  }
}
