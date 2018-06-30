import debug from 'debug';

import { initMongo } from '../mongo';
import authorizationCodeModel from '../models/authorizationCode';
import accessTokenModel from '../models/accessToken';
import clientCredentialsModel from '../models/clientCredential';
import initialAccessTokenModel from '../models/initialAccessToken';
import refreshTokenModel from '../models/refreshToken';
import registrationAccessTokenModel from '../models/registrationAccessToken';

const error = debug('error');

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
    this.client = customClient || initMongo();
    if (customClient) {
      this.model = tokenModel(customClient);
    } else {
      this.model = initMongo().then(tokenModel.bind(this));
    }
  }

  async upsert(id, payload) {
    const Token = await this.model;

    try {
      const result = await Token.findById(id);
      return result.update({ $set: payload }, {
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        upsert: true,
      });
    } catch (e) {
      error(e.message || e);
      return new Token(payload).save();
    }
  }

  async find(id, fields) {
    const Token = await this.model;

    try {
      const result = await Token.findById(id, fields);
      if (Array.isArray(result) && result.length === 0) {
        throw new Error(`No token found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return null;
    }
  }

  async destroy(id) {
    const Token = await this.model;

    try {
      const result = await Token.findByIdAndRemove(id);
      if (Array.isArray(result) && result.length === 0) {
        throw new Error(`No token found with ID: ${id}`);
      }
      return result;
    } catch (e) {
      error(e.message || e);
      return null;
    }
  }
}
