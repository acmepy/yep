import BaseTest from '../core/BaseTest.js';
import { getMessage } from '../errors/messages.js';
import { getTest } from '../core/registry.js';

export default class CustomTest extends BaseTest {
  constructor(name, fn, options = {}) {
    super(name, options);
    this.fn = fn;
  }

  async run(value, schema, data = {}) {
    const registered = getTest(this.name);
    if (!registered && !this.fn) {
      return null;
    }
    const fn = this.fn || registered?.fn;
    if (!fn) {
      return null;
    }
    const ok = await fn(value, schema?.fieldName || schema?.name || schema?.typeName, data, this.options);
    if (!ok) {
      const label = schema?.getLabel?.() || this.options.label || this.name;
      return { message: this.options.message?.({ label }) || getMessage('custom', { label }), fieldName: schema?.fieldName || schema?.name || schema?.typeName };
    }
    return null;
  }
}
