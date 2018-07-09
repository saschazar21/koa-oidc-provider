import passport from 'koa-passport';

import AbstractPassport from './abstract';
import LocalProvider from '../clients/local';

export default class LocalPassport extends AbstractPassport {
  constructor(pass) {
    super(LocalProvider, pass || passport);
  }

  async init() {
    return super.init();
  }
}
