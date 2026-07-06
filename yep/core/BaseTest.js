export default class BaseTest {
  constructor(name, options = {}) {
    this.name = name;
    this.options = options;
  }

  async run(value, schema, data = {}) {
    return null;
  }
}
