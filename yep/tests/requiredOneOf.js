import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export class RequiredOneOf extends BaseTest {
  static schemaMethod = false;

  constructor(fields, options = {}) {
    super('requiredOneOf', options);
    this.fields = fields;
  }

  async run(value, schema, data = {}) {
    const hasAny = this.fields.some((field) => data[field] !== undefined && data[field] !== null && data[field] !== '');
    if (!hasAny) {
      const labels = this.fields.map((field) => schema?.shapeDefinition?.[field]?.getLabel?.() || field);
      return {
        message: getMessage('requiredOneOf', { labels }),
        fieldName: this.fields[0],
        fieldNames: this.fields
      };
    }
    return null;
  }
}
