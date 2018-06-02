import { resolve } from 'path';

export const configDirRel = process.env.CONFIGDIR || './static/.well-known';
export const configDir = resolve(process.cwd(), configDirRel);
