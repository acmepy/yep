import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export class Max extends BaseTest {
  constructor(limit, options = {}) {
    super('max', options);
    this.limit = limit;
  }

  async run(value, schema) {
    if (value === undefined || value === null) {
      return null;
    }

    const comparableValue = typeof value === 'string' ? value.length : value;
    const isValid = (typeof value === 'string' || typeof value === 'number')
      && !Number.isNaN(comparableValue)
      && comparableValue < this.limit;

    if (!isValid) {
      const label = schema?.getLabel?.() || this.options.label || this.name;
      const message = this.options.message?.({ label, max: this.limit })
        || getMessage('max', { label, max: this.limit, typeName: schema?.typeName });
      return {
        message,
        fieldName: schema?.fieldName || schema?.name || schema?.typeName
      };
    }

    return null;
  }
}
