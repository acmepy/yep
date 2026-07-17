import { getMessage } from '../errors/messages.js';
import ValidationError from '../errors/ValidationError.js';
import { Required as RequiredTest } from '../tests/index.js';
import { Custom as CustomTest } from '../tests/index.js';
import { toJsonSchema } from '../json-schema/toJsonSchema.js';

export default class BaseType {
  constructor(typeName, options = {}) {
    this.typeName = typeName;
    this.titleText = '';
    this.fieldName = '';
    this.requiredFlag = false;
    this.nullableFlag = false;
    this.defaultValue = undefined;
    this.oneOfValues = undefined;
    this.notOneOfValues = undefined;
    this.regexPattern = undefined;
    this.customTests = [];
    this.tests = [];
    this.options = options;
  }

  title(title) {
    this.titleText = title;
    return this;
  }

  default(value) {
    this.defaultValue = value;
    return this;
  }

  addTest(name, fn, options = {}) {
    this.customTests.push({ name, fn, options });
    this.tests.push(new CustomTest(name, fn, options));
    return this;
  }

  getLabel() {
    return this.titleText || this.fieldName || this.typeName;
  }

  async validate(value, data = {}) {
    const title = this.getLabel();
    const fieldName = this.fieldName || this.name || this.typeName;
    const issues = [];

    if (value === undefined && this.defaultValue !== undefined) {
      value = this.defaultValue;
    }

    if (value === undefined) {
      if (this.requiredFlag) {
        const issue = await this.runTests(value, data, { skipTypeCheck: true });
        if (issue) {
          issues.push(issue.message);
        }
      } else {
        return value;
      }
    }

    if (value === null) {
      if (this.nullableFlag) {
        return null;
      }
      issues.push(getMessage('type', { title, typeName: this.typeName }));
    }

    if (value !== undefined && value !== null && !this.isValidType(value)) {
      issues.push(getMessage('type', { title, typeName: this.typeName }));
    }

    const testIssues = await this.runTests(value, data, { skipRequired: value === undefined });
    if (testIssues) {
      issues.push(testIssues.message);
    }

    if (issues.length > 0) {
      throw new ValidationError(issues.join(' | '), { [fieldName]: issues.join(' | ') });
    }

    return value;
  }

  async runTests(value, data = {}, options = {}) {
    const results = [];
    for (const test of this.tests) {
      if (options.skipRequired && test instanceof RequiredTest) {
        continue;
      }
      const result = await test.run(value, this, data);
      if (result) {
        results.push(result);
      }
    }
    if (results.length === 0) {
      return null;
    }
    return { message: results.map((item) => item.message).join(' | '), fieldName: results[0].fieldName };
  }

  isValidType(value) {
    return this.options.isValidType ? this.options.isValidType(value) : true;
  }

  toJsonSchema() {
    return toJsonSchema(this);
  }
}
