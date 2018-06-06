// TODO: Check for trailing /
export const host = process.env.HOST || 'localhost';
export const hostname = host;
export const port = process.env.PORT || 3000;

export const prefix = host === 'localhost' || host === '127.0.0.1' ? 'http://' : 'https://';
export const baseUrl = `${prefix}${host}${port === 443 || port === 80 ? '' : `:${port}`}`;

export const nuxtPrefix = `/${process.env.NUXT_PATH ? process.env.NUXT_PATH.split('/').filter(el => el.length > 0).join('/') : 'web'}`;
// TODO: check for trailing /
export const nuxtUrl = `${baseUrl}${nuxtPrefix}`;

export const oidcPrefix = `/${process.env.SUB_PATH ? process.env.SUB_PATH.split('/').filter(el => el.length > 0).join('/') : ''}`;
// TODO: check for trailing /
export const oidcUrl = oidcPrefix === '/' ? `${baseUrl}${oidcPrefix}` : baseUrl;
