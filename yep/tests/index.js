import Required from './required.js';
import Nullable from './nullable.js';
import OneOf from './oneOf.js';
import NotOneOf from './notOneOf.js';
import Regex from './regex.js';
import RequiredOneOf from './requiredOneOf.js';
import Custom from './custom.js';
import Email from './email.js';
import Positive from './positive.js';
import Min from './min.js';
import Max from './max.js';

export { Required, Nullable, OneOf, NotOneOf, Regex, RequiredOneOf, Custom, Email, Positive, Min, Max };

export const schemaTests = [
  {
    name: 'required',
    Test: Required,
    configure(schema) {
      schema.requiredFlag = true;
    }
  },
  {
    name: 'nullable',
    Test: Nullable,
    configure(schema) {
      schema.nullableFlag = true;
    }
  },
  {
    name: 'oneOf',
    Test: OneOf,
    configure(schema, values) {
      schema.oneOfValues = values;
    }
  },
  {
    name: 'notOneOf',
    Test: NotOneOf,
    configure(schema, values) {
      schema.notOneOfValues = values;
    }
  },
  {
    name: 'regex',
    Test: Regex,
    configure(schema, pattern) {
      schema.regexPattern = pattern;
    }
  },
  { name: 'email', Test: Email },
  { name: 'positive', Test: Positive },
  { name: 'min', Test: Min },
  { name: 'max', Test: Max }
];

export default schemaTests;
