export const host = process.env.HOST || 'localhost';
export const hostname = host;
export const port = process.env.PORT || 3000;
export const prefix = host === 'localhost' || host === '127.0.0.1' ? 'http://' : 'https://';
export const baseUrl = `${prefix}${host}${port === 443 || port === 80 ? '' : `:${port}`}`;
