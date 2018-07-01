import Promise from 'bluebird';

import { initMongo } from '../mongo';
import ClientAdapter from './clientAdapter';
import SessionAdapter from './sessionAdapter';
import TokenAdapter from './tokenAdapter';

export default class Adapter {
  constructor(name, customClient) {
    this.name = name;
    this.client = Promise.resolve(customClient) || initMongo();

    switch (name.toLowerCase()) {
      case 'session':
        this.Adapter = SessionAdapter;
        break;
      case 'client':
        this.Adapter = ClientAdapter;
        break;
      default:
        this.Adapter = TokenAdapter;
        break;
    }
  }

  async init() {
    this.adapter = this.adapter || new this.Adapter(this.name, await this.client);
    return this.adapter;
  }

  async upsert(id, payload, expiresIn) {
    const SubAdapter = this.adapter || await this.init();
    return SubAdapter.upsert(id, payload, expiresIn);
  }

  async find(id) {
    const SubAdapter = this.adapter || await this.init();
    return SubAdapter.find(id);
  }

  async destroy(id) {
    const SubAdapter = this.adapter || await this.init();
    return SubAdapter.destroy(id);
  }
}
