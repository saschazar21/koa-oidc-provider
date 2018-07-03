import Promise from 'bluebird';
import debug from 'debug';

import { initMongo } from '../mongo';
import ClientAdapter from './clientAdapter';
import SessionAdapter from './sessionAdapter';
import TokenAdapter from './tokenAdapter';

const error = debug('error:adapter');

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
    try {
      const result = await SubAdapter.upsert(id, payload, expiresIn);
      return result.toJSON();
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }

  async find(id) {
    const SubAdapter = this.adapter || await this.init();
    try {
      const result = await SubAdapter.find(id);
      return result.toJSON();
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }

  async consume(id) {
    const SubAdapter = this.adapter || await this.init();
    return SubAdapter.consume(id);
  }

  async destroy(id) {
    const SubAdapter = this.adapter || await this.init();
    try {
      const result = await SubAdapter.destroy(id);
      return result.toJSON();
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }
}
