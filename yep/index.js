import ObjectSchema from './core/ObjectSchema.js';
import BaseType from './core/BaseType.js';
import { registerType, registerTest } from './core/registry.js';
import types, { createType } from './types/index.js';
import { schemaTests } from './tests/index.js';
import { fromJsonSchema } from './json-schema/fromJsonSchema.js';
import { toJsonSchema } from './json-schema/toJsonSchema.js';

function createSchema(definition) {
  if (definition && typeof definition === 'object' && !Array.isArray(definition)) {
    return new ObjectSchema(definition);
  }
  return new ObjectSchema();
}

const yep = {
  object(definition) {
    if (definition) {
      return createSchema(definition);
    }
    return new ObjectSchema();
  },
  objectType() {
    return createType('object')();
  },
  addTest(name, fn, options = {}) {
    registerTest(name, fn, options);
    const prototype = Object.getPrototypeOf(this.string());
    prototype[name] = function () {
      return this.addTest(name, fn, options);
    };
    return this;
  },
  addType(name, isValidType) {
    registerType(name, isValidType);
    if (name !== 'object') {
      this[name] = () => createType(name)();
    }
    return this;
  },
  fromJsonSchema,
  toJsonSchema,
  validate(schema, data) {
    return schema.validate(data);
  }
};

for (const { name, Test, configure } of schemaTests) {
  BaseType.prototype[name] = function (...args) {
    configure?.(this, ...args);
    this.tests.push(new Test(...args));
    return this;
  };
}

for (const type of types) {
  yep.addType(type.name, type.isValidType);
}

export default yep;
