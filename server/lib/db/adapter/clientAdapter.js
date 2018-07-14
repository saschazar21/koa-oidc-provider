/* eslint  no-underscore-dangle: 0 */
import Promise from 'bluebird';
import debug from 'debug';

import { initMongo } from '../mongo';
import clientModel from '../models/client';

const error = debug('error:db');

export default class ClientAdapter {
  constructor(name, customClient) {
    this.name = name;
    this.client = customClient ? Promise.resolve(customClient) : initMongo();
    this.model = this.client.then(clientModel.bind(this));
  }

  async upsert(id, payload) {
    const Client = await this.model;

    try {
      const client = await Client.findById(id);
      if (!client) {
        throw new Error(`No client found w/ ID: ${id}. Attempting to create new one.`);
      }
      return client.update({
        $set: payload,
        $inc: { __v: 1 },
      }, {
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });
    } catch (e) {
      error(e.message || e);
      return new Client(payload).save();
    }
  }

  async find(id, fields) {
    const Client = await this.model;

    try {
      const result = await Client.findById(id, fields || '-__v');
      if (!result) {
        throw new Error(`No client found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }

  async destroy(id) {
    const Client = await this.model;

    try {
      const result = await Client.findByIdAndRemove(id);
      if (!result) {
        throw new Error(`No client found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }
}
