import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export class Positive extends BaseTest {
  constructor(options = {}) {
    super('positive', options);
  }

  async run(value, schema) {
    if (value === undefined || value === null) {
      return null;
    }

    const isPositiveNumber = typeof value === 'number'
      && !Number.isNaN(value)
      && value > 0;

    if (!isPositiveNumber) {
      const label = schema?.getLabel?.() || this.options.label || this.name;
      const message = this.options.message?.({ label }) || getMessage('positive', { label });
      return {
        message,
        fieldName: schema?.fieldName || schema?.name || schema?.typeName
      };
    }

    return null;
  }
}
