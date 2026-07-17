import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export class Regex extends BaseTest {
  static aliases = ['matches'];

  static configure(schema, pattern) {
    schema.regexPattern = pattern;
  }

  constructor(pattern, options = {}) {
    super('regex', options);
    this.pattern = pattern;
  }

  async run(value, schema) {
    const title = schema?.getLabel?.() || this.options.title || this.name;
    if (value !== undefined && value !== null && this.pattern && !this.pattern.test(value)) {
      return { message: getMessage('regex', { title }), fieldName: schema?.fieldName || schema?.name || schema?.typeName };
    }
    return null;
  }
}
