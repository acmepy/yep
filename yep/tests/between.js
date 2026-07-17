import BaseTest from '../core/BaseTest.js';

export class Between extends BaseTest {
  static configure(schema, min, max, options = {}) {
    schema.min(min, options);
    schema.max(max, options);
  }

  constructor(min, max, options = {}) {
    super('between', options);
    this.min = min;
    this.max = max;
  }
}
