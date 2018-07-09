import { isGoogleEnabled, isMicrosoftEnabled, isYahooEnabled } from '../../tools/auth';
import AbstractProvider from './abstract';

let config;

export default class ExternalProvider extends AbstractProvider {
  constructor(configuration) {
    super(configuration || config);
  }

  async client(name) {
    return super.client(name);
  }

  async google() {
    if (!isGoogleEnabled) {
      throw new Error(`Failed to create client for Google, check GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID} and GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET}`);
    }
    return this.client('google');
  }

  async microsoft() {
    if (!isMicrosoftEnabled) {
      throw new Error(`Failed to create client for Microsoft, check MICROSOFT_CLIENT_ID: ${process.env.MICROSOFT_CLIENT_ID} and MICROSOFT_CLIENT_SECRET: ${process.env.MICROSOFT_CLIENT_SECRET}`);
    }
    return this.client('microsoft');
  }

  async yahoo() {
    if (!isYahooEnabled) {
      throw new Error(`Failed to create client for Yahoo, check YAHOO_CLIENT_ID: ${process.env.YAHOO_CLIENT_ID} and YAHOO_CLIENT_SECRET: ${process.env.YAHOO_CLIENT_SECRET}`);
    }
    return this.client('yahoo');
  }

  static async init() {
    config = {
      google: {
        client: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
        },
        discoveryUrl: 'https://accounts.google.com',
      },
      microsoft: {
        client: {
          client_id: process.env.MICROSOFT_CLIENT_ID,
          client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        },
        discoveryUrl: 'https://login.windows.net/common',
      },
      yahoo: {
        client: {
          client_id: process.env.YAHOO_CLIENT_ID,
          client_secret: process.env.YAHOO_CLIENT_SECRET,
        },
        discoveryUrl: 'https://api.login.yahoo.com/',
      },
    };
    return config;
  }
}
