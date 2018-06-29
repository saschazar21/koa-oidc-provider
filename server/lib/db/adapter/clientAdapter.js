import debug from 'debug';

import { initMongo } from '../mongo';
import clientModel from '../models/client';

const error = debug('error');

export default class ClientAdapter {
  constructor(customClient) {
    this.client = customClient || initMongo();
    if (customClient) {
      this.model = clientModel(customClient);
    } else {
      this.model = initMongo().then(clientModel.bind(this));
    }
  }

  async upsert(id, payload) {
    const Client = await this.model;

    try {
      const client = await Client.findById(id);
      return client.update({ $set: payload }, {
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        upsert: true,
      });
    } catch (e) {
      error(e.message || e);
      try {
        return new Client(payload).save();
      } catch (err) {
        error(err.message || err);
        return null;
      }
    }
  }

  async find(id) {
    const Client = await this.model;

    try {
      const result = await Client.findById(id);
      if (Array.isArray(result) && result.length === 0) {
        throw new Error(`No client found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return null;
    }
  }

  async destroy(id) {
    const Client = await this.model;

    try {
      const result = await Client.findByIdAndRemove(id);
      if (Array.isArray(result) && result.length === 0) {
        throw new Error(`No client found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return null;
    }
  }
}
