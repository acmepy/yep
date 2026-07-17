import ValidationError from '../errors/ValidationError.js';
import { getMessage } from '../errors/messages.js';
import { RequiredOneOf as RequiredOneOfTest } from '../tests/index.js';
import { toJsonSchema } from '../json-schema/toJsonSchema.js';

function humanizeLabel(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default class ObjectSchema {
  constructor(shapeDefinition = {}) {
    this.shapeDefinition = shapeDefinition;
    this.requiredOneOfFields = [];
    this.tests = [];
  }

  shape(definition) {
    this.shapeDefinition = definition;
    return this;
  }

  requiredOneOf(fields) {
    this.requiredOneOfFields = fields;
    this.tests.push(new RequiredOneOfTest(fields));
    return this;
  }

  async validate(data = {}, options = {}) {
    const result = {};
    const errors = {};
    const safe = options?.safe === true;

    for (const [key, schema] of Object.entries(this.shapeDefinition)) {
      const value = data[key];
      if (!schema) {
        continue;
      }
      schema.fieldName = key;
      if (!schema.titleText) {
        schema.titleText = humanizeLabel(key);
      }
      try {
        const validated = await schema.validate(value, data);
        if (validated !== undefined) {
          result[key] = validated;
        }
      } catch (error) {
        const fieldErrors = error.errors || {};
        const firstError = fieldErrors[key] || fieldErrors[schema.fieldName] || error.message;
        if (typeof firstError === 'string') {
          errors[key] = firstError;
        } else if (firstError && typeof firstError === 'object') {
          Object.assign(errors, firstError);
        }
      }
    }

    if (this.tests.length > 0) {
      for (const test of this.tests) {
        const result = await test.run(undefined, this, data);
        if (result) {
          const fieldNames = Array.isArray(result.fieldNames)
            ? result.fieldNames
            : [result.fieldName];

          for (const fieldName of fieldNames) {
            if (fieldName) {
              errors[fieldName] = result.message;
            }
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      const count = Object.keys(errors).length;
      const message = count === 1
        ? 'Se ha producido 1 error'
        : `Se han producido ${count} errores`;
      if (safe) {
        return { message, errors };
      }
      throw new ValidationError(message, errors);
    }

    return result;
  }

  async validateAt(field, data = {}, options = {}) {
    const schema = this.shapeDefinition[field];
    if (!schema) {
      return undefined;
    }

    schema.fieldName = field;
    if (!schema.titleText) {
      schema.titleText = humanizeLabel(field);
    }

    try {
      return await schema.validate(data[field], data);
    } catch (error) {
      const safe = options?.safe === true;
      const errors = { [field]: error.errors?.[field] || error.message };
      if (safe) {
        return { message: error.message, errors };
      }
      throw new ValidationError(error.message, errors);
    }
  }

  toJsonSchema() {
    return toJsonSchema(this);
  }
}
