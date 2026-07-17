import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export class Max extends BaseTest {
  constructor(limit, options = {}) {
    super('max', options);
    this.limit = limit;
  }

  async run(value, schema) {
    if (value === undefined || value === null) return null;

    const isDateValue = value instanceof Date && !Number.isNaN(value.getTime());
    const isDateLimit = this.limit instanceof Date && !Number.isNaN(this.limit.getTime());
    const comparableValue = isDateValue ? value.getTime() : (typeof value === 'string' ? value.length : value);
    const comparableLimit = isDateLimit ? this.limit.getTime() : this.limit;
    const isValid = (typeof value === 'string' || typeof value === 'number' || isDateValue)
      && !Number.isNaN(comparableValue)
      && comparableValue <= comparableLimit;

    if (!isValid) {
      const label = schema?.getLabel?.() || this.options.label || this.name;
      const message = this.options.message?.({ label, max: this.limit }) || getMessage('max', { label, max: this.limit, typeName: schema?.typeName });
      return {
        message,
        fieldName: schema?.fieldName || schema?.name || schema?.typeName
      };
    }

    return null;
  }
}
