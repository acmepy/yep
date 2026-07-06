import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export default class OneOfTest extends BaseTest {
  constructor(values, options = {}) {
    super('oneOf', options);
    this.values = values;
  }

  async run(value, schema) {
    const label = schema?.getLabel?.() || this.options.label || this.name;
    if (value !== undefined && value !== null && this.values !== undefined && !this.values.includes(value)) {
      return { message: getMessage('oneOf', { label }), fieldName: schema?.fieldName || schema?.name || schema?.typeName };
    }
    return null;
  }
}
