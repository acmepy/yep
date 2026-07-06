import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export default class NotOneOfTest extends BaseTest {
  constructor(values, options = {}) {
    super('notOneOf', options);
    this.values = values;
  }

  async run(value, schema) {
    const label = schema?.getLabel?.() || this.options.label || this.name;
    if (value !== undefined && value !== null && this.values !== undefined && this.values.includes(value)) {
      return { message: getMessage('notOneOf', { label }), fieldName: schema?.fieldName || schema?.name || schema?.typeName };
    }
    return null;
  }
}
