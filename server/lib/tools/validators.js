import debug from 'debug';

import Configuration from '../config';
import * as values from './values';

const configuration = new Configuration();
const error = debug('error');

const compare = (comp, truth) => {
  const c = Array.isArray(comp) ? comp : [comp];
  const filtered = c
    .filter(value => truth
      .findIndex(v => v === value) >= 0);
  return filtered.length === c.length;
};

export async function filter(compareIdentifier, filterIdentifier) {
  let supported = values[compareIdentifier] || [];
  try {
    const config = await configuration.getConfig();
    if (!config.unsupported || !config.unsupported[filterIdentifier]) {
      throw new Error('No unsupported algorithms found to filter. Using default.');
    }
    const unsupported = config.unsupported[filterIdentifier];
    supported = values[compareIdentifier]
      .filter(c => unsupported
        .findIndex(t => t === c) < 0);
  } catch (e) {
    error(e.message || e);
    supported = values[compareIdentifier];
  }
  return supported;
}

export function applicationType(entry) {
  return values.applicationType.findIndex(el => el === entry) >= 0;
}

export async function responseTypes(types) {
  let supported;
  try {
    const config = await configuration.getConfig();
    if (!config.responseTypes) {
      throw new Error('No response type configuration available. Using default.');
    }
    supported = config.responseTypes;
  } catch (e) {
    error(e.message || e);
    supported = values.responseTypes;
  }
  return compare(types, supported);
}

export function grantTypes(types) {
  return compare(types, values.grantTypes);
}

export async function idTokenEncryptedResponseAlg(alg) {
  const supported = await filter('encryptionAlg', 'idTokenEncryptedResponseAlg');
  return supported.findIndex(v => v === alg) >= 0;
}

export async function idTokenEncryptedResponseEnc(enc) {
  const supported = await filter('encryptionEnc', 'idTokenEncryptionEncValues');
  return supported.findIndex(v => v === enc) >= 0;
}

export async function idTokenSignedResponseAlg(alg) {
  const supported = await filter('signatureAlg', 'idTokenSigningAlgValues');
  return supported.findIndex(v => v === alg) >= 0;
}

export async function introspectionEndpointAuthSigningAlg(alg) {
  const supported = await filter('signatureAlg', 'introspectionEndpointAuthSigningAlgValues');
  return supported.findIndex(v => v === alg) >= 0;
}

export async function revocationEndpointAuthSigningAlg(alg) {
  const supported = await filter('signatureAlg', 'revocationEndpointAuthSigningAlgValues');
  return supported.findIndex(v => v === alg) >= 0;
}


export async function requestObjectEncryptionAlg(alg) {
  const supported = await filter('encryptionAlg', 'requestObjectEncryptionAlgValues');
  return supported.findIndex(v => v === alg) >= 0;
}

export async function requestObjectEncryptionEnc(enc) {
  const supported = await filter('encryptionEnc', 'requestObjectEncryptionEncValues');
  return supported.findIndex(v => v === enc) >= 0;
}

export async function requestObjectSigningAlg(alg) {
  const supported = await filter('signatureAlg', 'requestObjectSigningAlgValues');
  return supported.findIndex(v => v === alg) >= 0;
}

export async function tokenEndpointAuthMethod(method) {
  let supported;
  try {
    const config = await configuration.getConfig();
    if (!config.tokenEndpointAuthMethods) {
      throw new Error('No token endpoint auth methods configuration available. Using default.');
    }
    supported = config.tokenEndpointAuthMethods;
  } catch (e) {
    error(e.message || e);
    supported = values.tokenEndpointAuthMethod;
  }
  return supported.findIndex(v => v === method) >= 0;
}

export async function tokenEndpointAuthSigningAlg(alg) {
  const supported = await filter('signatureAlg', 'tokenEndpointAuthSigningAlgValues');
  return alg === 'none' ? false : supported.findIndex(v => v === alg) >= 0;
}

export async function userinfoEncryptionAlg(alg) {
  const supported = await filter('encryptionAlg', 'userinfoEncryptionAlgValues');
  return supported.findIndex(v => v === alg) >= 0;
}

export async function userinfoEncryptionEnc(enc) {
  const supported = await filter('encryptionEnc', 'userinfoEncryptionEncValues');
  return supported.findIndex(v => v === enc) >= 0;
}

export async function userinfoSigningAlg(alg) {
  const supported = await filter('singatureAlg', 'userinfoSigningAlgValues');
  return supported.findIndex(v => v === alg) >= 0;
}

