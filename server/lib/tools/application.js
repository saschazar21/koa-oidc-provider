import pkg from '../../../package.json';

export const appName = process.env.APP_NAME || pkg.name;
export const maintainer = process.env.MAINTAINER || pkg.author;
