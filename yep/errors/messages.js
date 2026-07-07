function formatValue(value) {
  return value instanceof Date && !Number.isNaN(value.getTime())
    ? value.toISOString()
    : value;
}

const messages = {
  required: ({ label }) => `${label} es requerido`,
  nullable: ({ label }) => `${label} no puede ser null`,
  type: ({ label, typeName }) => `${label} debe ser de tipo ${typeName}`,
  oneOf: ({ label }) => `${label} debe ser uno de los valores permitidos`,
  notOneOf: ({ label }) => `${label} no puede ser uno de los valores permitidos`,
  requiredOneOf: ({ labels }) => `Debe completar al menos uno de los campos: ${labels.join(', ')}`,
  regex: ({ label }) => `${label} no cumple con el formato esperado`,
  positive: ({ label }) => `${label} debe ser un número mayor a 0`,
  min: ({ label, min, typeName }) => typeName === 'string'
    ? `${label} debe tener al menos ${min} caracteres`
    : `${label} debe ser mayor o igual a ${formatValue(min)}`,
  max: ({ label, max, typeName }) => typeName === 'string'
    ? `${label} debe tener como máximo ${max} caracteres`
    : `${label} debe ser menor o igual a ${formatValue(max)}`,
  default: ({ label }) => `${label} se completó con un valor por defecto`,
  custom: ({ label }) => `${label} no es válido`
};

export function getMessage(key, params = {}) {
  const formatter = messages[key];
  if (!formatter) {
    return params.message || 'Valor inválido';
  }
  return formatter(params);
}

export default messages;
