/* global isNaN */
/* eslint no-restricted-globals: ["off", "isNaN"] */

import { idFactory } from './id';

let timestamp = Date.now();
const keys = [idFactory()];

export const deltaTime = 600000;
export const maxLength = 32;

export default function keyFactory(delta) {
  const d = Date.now();
  const t = !isNaN(parseInt(`${delta}`, 10)) ? delta : deltaTime;
  if (d - timestamp >= t) {
    timestamp = d;
    keys.push(idFactory());
    if (keys.length > 32) {
      keys.pop();
    }
  }
  return keys;
}
