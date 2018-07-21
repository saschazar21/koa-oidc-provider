import { parse } from 'url';

import { initMongo } from '../mongo';
import { safeIdFactory, idFactory } from '../../tools/id';
import { isEmail, isUrl, responseTypes, grantTypes, idTokenSignedResponseAlg, idTokenEncryptedResponseAlg, idTokenEncryptedResponseEnc, userinfoSigningAlg, userinfoEncryptionAlg, userinfoEncryptionEnc, requestObjectSigningAlg, requestObjectEncryptionAlg, requestObjectEncryptionEnc, tokenEndpointAuthMethod, tokenEndpointAuthSigningAlg } from '../../tools/validators';
import { compareHash } from '../../tools/password';

/**
  * Client model
  * {
    token_endpoint_auth_method: 'none',
    client_id: 'mywebsite',
    grant_types: ['implicit'],
    response_types: ['id_token'],
    redirect_uris: ['https://client.example.com/cb'],
  },
  */

function clientSecret() {
  return idFactory(64);
}

export default async function clientModel(customClient) {
  const mongoose = customClient || await initMongo();

  if (mongoose.models.Client) {
    return mongoose.models.Client;
  }

  const clientSchema = new mongoose.Schema({
    _id: {
      default: safeIdFactory,
      type: String,
    },
    active: {
      default: true,
      type: Boolean,
    },
    owner: {
      required: true,
      type: String,
      ref: 'User',
    },
    client_id: {
      default() {
        // eslint-disable-next-line no-underscore-dangle
        return this._id;
      },
      type: String,
    },
    client_secret: {
      default: clientSecret,
      type: String,
    },
    redirect_uris: {
      lowercase: true,
      type: [String],
      validate: {
        validator(value) {
          const sane = value.filter((v) => {
            const u = parse(v);
            if (!this.application_type || this.application_type === 'web') {
              return isUrl(v) && u.hostname !== 'localhost';
            }
            return (u.protocol !== 'http:' && u.protocol !== 'https:') || u.hostname === 'localhost';
          });
          return sane.length === value.length;
        },
        message: 'One of the given URIs either contains localhost and was declared as "web", or vice versa',
      },
      required: true,
    },
    response_types: {
      default: ['code'],
      lowercase: true,
      type: [String],
      validate: {
        validator: responseTypes,
        message: 'One of the given response types is not one of the following: code, id_token, token or a combination of them',
      },
    },
    grant_types: {
      default: ['authorization_code'],
      type: [String],
      validate: {
        validator: grantTypes,
        message: 'One of the given grant types is not one of the following: authorization_code, implicit, refresh_token',
      },
    },
    application_type: {
      default: 'web',
      lowercase: true,
      type: String,
      validate: {
        validator: val => val.toLowerCase() === 'web' || val.toLowerCase() === 'native',
        message: '{VALUE} not allowed, must be one of "web" or "native"',
      },
    },
    contacts: {
      lowercase: true,
      type: [String],
      validate: {
        validator: function checkEmail(value) {
          const sane = value.filter(v => isEmail(v));
          return sane.length === value.length;
        },
        message: '{VALUE} is not a valid e-mail address.',
      },
    },
    client_name: {
      required: true,
      type: String,
      unique: true,
    },
    logo_uri: {
      lowercase: true,
      type: String,
      validate: {
        validator: isUrl,
        message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
      },
    },
    client_uri: {
      lowercase: true,
      type: String,
      validate: {
        validator: isUrl,
        message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
      },
    },
    policy_uri: {
      lowercase: true,
      type: String,
      validate: {
        validator: isUrl,
        message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
      },
    },
    tos_uri: {
      lowercase: true,
      type: String,
      validate: {
        validator: isUrl,
        message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
      },
    },
    jwks_uri: {
      lowercase: true,
      type: String,
      validate: {
        validator: isUrl,
        message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
      },
    },
    jwks: {
      lowercase: true,
      type: String,
      validate: {
        validator: function checkJwksUri() {
          return !!this.jwks_uri;
        },
        message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
      },
    },
    sector_identifier_uri: {
      lowercase: true,
      type: String,
      validate: {
        validator: isUrl,
        message: '{VALUE} is not a valid URL, URLs begin with http{s}://',
      },
    },
    subject_type: {
      lowercase: true,
      type: String,
      validate: {
        validator: function checkSubjecttype() {
          return this.subject_type === 'pairwise' || this.subject_type === 'public';
        },
        message: '{VALUE} must either be "pairwise" or "public"',
      },
    },
    id_token_signed_response_alg: {
      default: 'RS256',
      type: String,
      validate: {
        validator: async function checkAlg(value) {
          if (!await idTokenSignedResponseAlg(value)) {
            if (value.toLowerCase() === 'none') {
              return Array.isArray(this.grant_types) && this.grant_types.length === 1 && this.grant_types[0] === 'authorization_code';
            }
            return false;
          }
          return true;
        },
        message: '{VALUE} is not a valid signing algorithm, please check again',
      },
    },
    id_token_encrypted_response_alg: {
      required: function isResponseEnc() {
        return this.id_token_encrypted_response_enc;
      },
      type: String,
      validate: {
        validator: idTokenEncryptedResponseAlg,
        message: '{VALUE} is not a valid value for "alg", please check again',
      },
    },
    id_token_encrypted_response_enc: {
      required: function isResponseAlg() {
        return this.id_token_encrypted_response_alg;
      },
      type: String,
      validate: {
        validator: idTokenEncryptedResponseEnc,
        message: '{VALUE} is not a valid value for "enc", please check again',
      },
    },
    userinfo_signed_response_alg: {
      type: String,
      validate: {
        validator: userinfoSigningAlg,
        message: '{VALUE} is not a valid signing algorithm, please check again',
      },
    },
    userinfo_encrypted_response_alg: {
      required: function isResponseEnc() {
        return this.userinfo_encrypted_response_enc;
      },
      type: String,
      validate: {
        validator: userinfoEncryptionAlg,
        message: '{VALUE} is not a valid value for "alg", please check again',
      },
    },
    userinfo_encrypted_response_enc: {
      required: function isResponseAlg() {
        return this.userinfo_encrypted_response_alg;
      },
      type: String,
      validate: {
        validator: userinfoEncryptionEnc,
        message: '{VALUE} is not a valid value for "enc", please check again',
      },
    },
    request_object_signing_alg: {
      type: String,
      validate: {
        validator: async function checkROAlg(value) {
          return requestObjectSigningAlg(value) || value === 'none';
        },
        message: '{VALUE} is not a valid signing algorithm, please check again',
      },
    },
    request_object_encryption_alg: {
      required: function isResponseEnc() {
        return this.request_object_encryption_enc;
      },
      type: String,
      validate: {
        validator: requestObjectEncryptionAlg,
        message: '{VALUE} is not a valid value for "alg", please check again',
      },
    },
    request_object_encryption_enc: {
      required: function isResponseAlg() {
        return this.request_object_encryption_alg;
      },
      type: String,
      validate: {
        validator: requestObjectEncryptionEnc,
        message: '{VALUE} is not a valid value for "enc", please check again',
      },
    },
    token_endpoint_auth_method: {
      default: 'client_secret_basic',
      type: String,
      validate: {
        validator: async function checkEndpointAuth(value) {
          return tokenEndpointAuthMethod(value) || value === 'none';
        },
        message: '{VALUE} is not a valid auth method, please check again',
      },
    },
    token_endpoint_auth_signing_alg: {
      type: String,
      validate: {
        validator: tokenEndpointAuthSigningAlg,
        message: '{VALUE} is not a valid signing algorithm, please check again',
      },
    },
    default_max_age: Number,
    require_auth_time: {
      default: false,
      type: Boolean,
    },
    default_acr_values: [String],
    initiate_login_uri: {
      lowercase: true,
      type: String,
      validate: {
        validator: isUrl,
        message: '{VALUE} is not a valid URI scheme starting with http(s)',
      },
    },
    request_uris: {
      lowercase: true,
      type: [String],
      validate: {
        validator: function validateURI(value) {
          const sane = value.filter(v => isUrl(v));
          return sane.length === value.length;
        },
        message: 'One of the given URIs is not a valid URI starting with http(s)',
      },
    },
  });

  clientSchema.pre('save', async function genPasswd(next) {
    if (this.logo_uri) {
      return next();
    }
    // TODO: Implement picture profile
    // this.logo_uri = await cat();
    return next();
  });

  clientSchema.methods.correctPassword = async function correctPasswd(plaintext) {
    return compareHash(plaintext, this.password);
  };

  clientSchema.methods.resetPassword = async function resetPasswd() {
    this.set({
      client_secret: clientSecret(),
      __v: this.get('__v') + 1,
    });
    return this.save();
  };

  return mongoose.model('Client', clientSchema);
}
