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
    const title = schema?.getLabel?.() || this.options.title || this.name;
    if (value === undefined || value === '') {
      return { message: getMessage('required', { title }), fieldName: schema?.fieldName || schema?.name || schema?.typeName };
    }
    return null;
  }
}
