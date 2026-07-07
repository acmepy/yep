import BaseTest from '../core/BaseTest.js';

export class Nullable extends BaseTest {
  static configure(schema) {
    schema.nullableFlag = true;
  }

  constructor(options = {}) {
    super('nullable', options);
  }

  async run(value) {
    return value === null ? null : null;
  }
}
