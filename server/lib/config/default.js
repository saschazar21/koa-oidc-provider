import { acrValues } from './acrValues';
import audiences from './audiences';
import { claims } from './claims';
import { clientCacheDuration } from './clientCacheDuration';
import { clockTolerance } from './clockTolerance';
import { cookies } from './cookies';
import { discovery } from './discovery';
import { properties, validator } from './extraClientMetadata';
import { extraParams } from './extraParams';
import { features } from './features';
import findById from './findById';
import { formats } from './formats';
import frontchannelLogoutPendingSource from './frontchannelLogoutPendingSource';
import interactionUrl from './interactionUrl';
import { introspectionEndpointAuthMethods } from './introspectionEndpointAuthMethods';
import logoutSource from './logoutSource';
import { pairwiseSalt } from './pairwiseSalt';
import postLogoutRedirectUri from './postLogoutRedirectUri';
import { prompts } from './prompts';
import { refreshTokenRotation } from './refreshTokenRotation';
import renderError from './renderError';
import { responseTypes } from './responseTypes';
import { revocationEndpointAuthMethods } from './revocationEndpointAuthMethods';
import { routes } from './routes';
import { scopes } from './scopes';
import { subjectTypes } from './subjectTypes';
import { tokenEndpointAuthMethods } from './tokenEndpointAuthMethods';
import { ttl } from './ttl';
import { unsupported } from './unsupported';

export default {
  acrValues,
  audiences,
  claims,
  clientCacheDuration,
  clockTolerance,
  cookies,
  discovery,
  extraClientMetadata: {
    properties,
    validator,
  },
  extraParams,
  features,
  findById,
  formats,
  frontchannelLogoutPendingSource,
  interactionUrl,
  introspectionEndpointAuthMethods,
  logoutSource,
  pairwiseSalt,
  postLogoutRedirectUri,
  prompts,
  refreshTokenRotation,
  renderError,
  responseTypes,
  revocationEndpointAuthMethods,
  routes,
  scopes,
  subjectTypes,
  tokenEndpointAuthMethods,
  ttl,
  unsupported,
};
