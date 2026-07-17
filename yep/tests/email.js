import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';

export class Email extends BaseTest {
  constructor(options = {}) {
    super('email', options);
  }

  async run(value, schema) {
    const title = schema?.getLabel?.() || this.options.title || this.name;
    if (value !== undefined && value !== null && typeof value === 'string') {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValid) {
        const message = this.options.message?.({ title }) || `${title} no tiene un formato de correo válido`;
        return { message, fieldName: schema?.fieldName || schema?.name || schema?.typeName };
      }
    }
    return null;
  }
}
