import passport from 'koa-passport';

import AbstractPassport from './abstract';
import ExternalProvider from '../clients/external';

export default class ExternalPassport extends AbstractPassport {
  constructor(pass) {
    super(ExternalProvider, pass || passport);
  }

  async init(name) {
    return super.init(name);
  }
}
