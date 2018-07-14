/* eslint no-underscore-dangle: 0 */
import Promise from 'bluebird';
import debug from 'debug';

import { initMongo } from '../mongo';
import sessionModel from '../models/session';

const error = debug('error:db');

export default class SessionAdapter {
  constructor(name, customClient) {
    this.name = name;
    this.client = customClient ? Promise.resolve(customClient) : initMongo();
    this.model = this.client.then(sessionModel.bind(this));
  }

  async upsert(id, payload) {
    const Session = await this.model;
    const data = payload;
    if (data.__v) {
      delete data.__v;
    }

    try {
      const result = await Session.findByIdAndUpdate(id, {
        $set: data,
        $inc: { __v: 1 },
      }, {
        new: true,
        setDefaultsOnInsert: true,
      });
      if (!result) {
        throw new Error(`No session found w/ ID: ${id}. Attempting to create new one.`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return new Session({
        ...data,
        _id: id,
      }).save();
    }
  }

  async find(id) {
    const Session = await this.model;

    try {
      const result = await Session.findById(id);
      if (!result) {
        throw new Error(`No session found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }

  async destroy(id) {
    const Session = await this.model;

    try {
      const result = await Session.findByIdAndRemove(id);
      if (!result) {
        throw new Error(`No session found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }
}
