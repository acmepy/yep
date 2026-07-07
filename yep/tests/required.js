import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export class Required extends BaseTest {
  static configure(schema) {
    schema.requiredFlag = true;
  }

  constructor(options = {}) {
    super('required', options);
  }

  async run(value, schema) {
    const label = schema?.getLabel?.() || this.options.label || this.name;
    if (value === undefined || value === '') {
      return { message: getMessage('required', { label }), fieldName: schema?.fieldName || schema?.name || schema?.typeName };
    }
    return null;
  }
}
