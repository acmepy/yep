function formatValue(value) {
  return value instanceof Date && !Number.isNaN(value.getTime())
    ? value.toISOString()
    : value;
}

const messages = {
  required: ({ title }) => `${title} es requerido`,
  nullable: ({ title }) => `${title} no puede ser null`,
  type: ({ title, typeName }) => `${title} debe ser de tipo ${typeName}`,
  oneOf: ({ title }) => `${title} debe ser uno de los valores permitidos`,
  notOneOf: ({ title }) => `${title} no puede ser uno de los valores permitidos`,
  requiredOneOf: ({ titles }) => `Debe completar al menos uno de los campos: ${titles.join(', ')}`,
  regex: ({ title }) => `${title} no cumple con el formato esperado`,
  positive: ({ title }) => `${title} debe ser un número mayor a 0`,
  min: ({ title, min, typeName }) => typeName === 'string'
    ? `${title} debe tener al menos ${min} caracteres`
    : `${title} debe ser mayor o igual a ${formatValue(min)}`,
  max: ({ title, max, typeName }) => typeName === 'string'
    ? `${title} debe tener como máximo ${max} caracteres`
    : `${title} debe ser menor o igual a ${formatValue(max)}`,
  default: ({ title }) => `${title} se completó con un valor por defecto`,
  custom: ({ title }) => `${title} no es válido`
};

export function getMessage(key, params = {}) {
  const formatter = messages[key];
  if (!formatter) {
    return params.message || 'Valor inválido';
  }
  return formatter(params);
}

export default messages;
