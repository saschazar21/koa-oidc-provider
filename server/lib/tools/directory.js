import { resolve } from 'path';

export const privateDirRel = process.env.PRIVATE_DIR || './private';
export const privateDir = resolve(process.cwd(), privateDirRel);
