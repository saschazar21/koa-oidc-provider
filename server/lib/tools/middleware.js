import Promise from 'bluebird';
import debug from 'debug';

import { getBaseClient } from '../config/clients';
import registrationEnabled from './registration';
import bootstrapProvider from '../../provider';
import Configuration from '../config';
import grantTypes from './grantTypes';
import { baseUrl } from './url';

const error = debug('error:router');
const configuration = new Configuration();

export default async (ctx, next) => {
  let client;
  const provider = await bootstrapProvider();

  if (ctx.query.client_id) {
    try {
      client = await provider.Client.find(ctx.query.client_id, '-__v -client_secret');
    } catch (e) {
      error(e.message || e);
      ctx.status = 400;
      ctx.body = {
        error: e.message,
      };
      return null;
    }
  }

  try {
    const [
      { responseTypes, routes },
      baseClient,
      supportedGrantTypes,
      registration,
    ] = await Promise.all([
      configuration.getConfig(),
      getBaseClient(),
      grantTypes(),
      registrationEnabled(),
    ]);

    const query = {
      ...ctx.query,
      client_id: null,
    };
    ctx.state = {
      ...ctx.state,
      baseClient,
      client,
      setup: {
        ...ctx.state.setup,
        ...query,
        baseUrl,
        grantTypes: supportedGrantTypes,
        registration,
        responseTypes,
        routes,
      },
    };
  } catch (e) {
    error(e.message || e);
    error('Unable to store client in request object. User registration disabled.');
  }
  return next();
};
