import BaseTest from '../core/BaseTest.js';

export default class NullableTest extends BaseTest {
  constructor(options = {}) {
    super('nullable', options);
  }

  async run(value) {
    return value === null ? null : null;
  }
}
