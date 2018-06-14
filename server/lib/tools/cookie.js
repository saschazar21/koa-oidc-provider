/* global isNaN */
/* eslint no-restricted-globals: ["off", "isNaN"] */

import { idFactory } from './id';

let i = 0;
let timestamp = Date.now();
const keys = [];

export const deltaTime = 600000;
export const maxLength = 16;

while (i < maxLength) {
  keys.push(idFactory(16));
  i += 1;
}

export default function keyFactory(delta) {
  const d = Date.now();
  const t = !isNaN(parseInt(`${delta}`, 10)) ? delta : deltaTime;
  if (d - timestamp >= t) {
    timestamp = d;
    keys.unshift(keys.pop());
  }
  return keys;
}
