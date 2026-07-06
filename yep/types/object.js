export const name = 'object';

export function isValidType(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
