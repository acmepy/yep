import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export class In extends BaseTest {
  static configure(schema, values) {
    schema.oneOfValues = values;
  }

  constructor(values, options = {}) {
    super('in', options);
    this.values = values;
  }

  async run(value, schema) {
    const title = schema?.getLabel?.() || this.options.title || this.name;
    if (value !== undefined && value !== null && this.values !== undefined && !this.values.includes(value)) {
      return { message: getMessage('oneOf', { title }), fieldName: schema?.fieldName || schema?.name || schema?.typeName };
    }
    return null;
  }
}
