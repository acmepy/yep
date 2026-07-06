import * as string from './string.js';
import * as number from './number.js';
import * as boolean from './boolean.js';
import * as date from './date.js';
import * as object from './object.js';
import * as array from './array.js';
import { getType } from '../core/registry.js';
import BaseType from '../core/BaseType.js';

const types = [string, number, boolean, date, object, array];

export function createType(typeName) {
  const isValidType = getType(typeName);
  return isValidType
    ? () => new BaseType(typeName, { isValidType })
    : undefined;
}

export default types;
