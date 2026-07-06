import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export default class Email extends BaseTest {
  constructor(options = {}) {
    super('email', options);
  }

  async run(value, schema) {
    const label = schema?.getLabel?.() || this.options.label || this.name;
    if (value !== undefined && value !== null && typeof value === 'string') {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValid) {
        const message = this.options.message?.({ label }) || `${label} no tiene un formato de correo válido`;
        return { message, fieldName: schema?.fieldName || schema?.name || schema?.typeName };
      }
    }
    return null;
  }
}
