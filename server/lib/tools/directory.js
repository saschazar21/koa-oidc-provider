import { resolve } from 'path';

export const publicDirRel = process.env.PUBLIC_DIR || './static/.well-known';
export const publicDir = resolve(process.cwd(), publicDirRel);

export const privateDirRel = process.env.PRIVATE_DIR || './private';
export const privateDir = resolve(process.cwd(), privateDirRel);
