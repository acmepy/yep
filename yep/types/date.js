export const name = 'date';

export function isValidType(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
