import Promise from 'bluebird';
import debug from 'debug';

import { initMongo } from '../mongo';
import authorizationCodeModel from '../models/authorizationCode';
import accessTokenModel from '../models/accessToken';
import clientCredentialsModel from '../models/clientCredential';
import initialAccessTokenModel from '../models/initialAccessToken';
import refreshTokenModel from '../models/refreshToken';
import registrationAccessTokenModel from '../models/registrationAccessToken';

const error = debug('error:db');

export default class TokenAdapter {
  constructor(name, customClient) {
    let tokenModel;
    switch (name.toLowerCase()) {
      case 'authorizationcode':
        tokenModel = authorizationCodeModel;
        break;
      case 'accesstoken':
        tokenModel = accessTokenModel;
        break;
      case 'refreshtoken':
        tokenModel = refreshTokenModel;
        break;
      case 'clientcredentials':
        tokenModel = clientCredentialsModel;
        break;
      case 'initialaccesstoken':
        tokenModel = initialAccessTokenModel;
        break;
      case 'registrationaccesstoken':
        tokenModel = registrationAccessTokenModel;
        break;
      default:
        tokenModel = authorizationCodeModel;
    }
    this.client = customClient ? Promise.resolve(customClient) : initMongo();
    this.model = this.client.then(tokenModel.bind(this));
  }

  async upsert(id, payload, expiresIn) {
    const Token = await this.model;
    try {
      const result = await Token.findById(id);
      if (!result) {
        throw new Error(`No token found w/ ID: ${id}. Attempting to create new one.`);
      }
      return result.update({
        $set: payload,
        $inc: { __v: 1 },
      }, {
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });
    } catch (e) {
      error(e.message || e);
      let model = payload;
      // eslint-disable-next-line no-restricted-globals
      if (expiresIn && !isNaN(parseInt(expiresIn.toString(), 10))) {
        model = {
          ...payload,
          expiresAt: new Date(Date.now() + (expiresIn * 1000.0)),
        };
      }
      return new Token(model).save();
    }
  }

  async consume(id) {
    const Token = await this.model;

    try {
      const result = await Token.findByIdAndUpdate(id, {
        $set: { consumed: new Date() },
        $inc: { __v: 1 },
      }, {
        new: true,
        upsert: false,
      });
      if (!result) {
        throw new Error(`No token found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }

  async find(id, fields) {
    const Token = await this.model;

    try {
      const result = await Token.findById(id, fields);
      if (!result) {
        throw new Error(`No token found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }

  async destroy(id) {
    const Token = await this.model;

    try {
      const result = await Token.findByIdAndRemove(id);
      if (!result) {
        throw new Error(`No token found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }
}
