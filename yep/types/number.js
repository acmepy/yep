export const name = 'number';

export function isValidType(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}
