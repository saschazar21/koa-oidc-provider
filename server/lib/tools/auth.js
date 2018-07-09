export const isGoogleEnabled = !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET;

export const isMicrosoftEnabled = !process.env.MICROSOFT_CLIENT_ID
  || !process.env.MICROSOFT_CLIENT_SECRET;

export const isYahooEnabled = !process.env.YAHOO_CLIENT_ID || !process.env.YAHOO_CLIENT_SECRET;
