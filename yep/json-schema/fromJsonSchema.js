import { createType } from '../types/index.js';
import ObjectSchema from '../core/ObjectSchema.js';

function createFieldSchema(schema) {
  const declaredTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
  const typeName = declaredTypes.find((type) => type !== 'null') || 'string';
  const type = createType(typeName) || createType('string');
  const instance = type();

  if (schema.title) instance.label(schema.title);
  if (declaredTypes.includes('null')) instance.nullable();
  if (Object.hasOwn(schema, 'default')) instance.default(schema.default);
  if (schema.oneOf) {
    instance.oneOf(schema.oneOf);
  } else if (schema.enum) {
    instance.oneOf(schema.enum);
  }
  if (schema.not?.enum) instance.notOneOf(schema.not.enum);
  if (schema.pattern) instance.regex(new RegExp(schema.pattern));
  if (schema.format === 'email') instance.email();
  return instance;
}

export function fromJsonSchema(schema) {
  if (!schema || typeof schema !== 'object') {
    throw new Error('JSON Schema invÃ¡lido');
  }

  if (schema.type === 'object' && schema.properties) {
    const required = new Set(schema.required || []);
    const shape = Object.fromEntries(
      Object.entries(schema.properties).map(([key, value]) => {
        const instance = createFieldSchema(value);
        if (required.has(key)) instance.required();
        return [key, instance];
      })
    );
    return new ObjectSchema(shape);
  }

  return createFieldSchema(schema);
}

export default fromJsonSchema;

