/* global isNaN */
/* eslint no-restricted-globals: ["off", "isNaN"] */

import nanoid from 'nanoid';
import generator from 'nanoid/generate';

const digits = '0123456789';
const smallCaps = `${digits}abcdefghijklmnopqrstuvwxyz`;
const allCaps = `${smallCaps}ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

export const defaultIdLength = 32;

export function safeIdFactory(length) {
  const len = !isNaN(parseInt(`${length}`, 10)) ? length : defaultIdLength;
  return generator(allCaps, len);
}

export function idFactory(length) {
  const len = !isNaN(parseInt(`${length}`, 10)) ? length : defaultIdLength;
  return nanoid(len);
}
