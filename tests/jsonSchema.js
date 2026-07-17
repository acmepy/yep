import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('toJsonSchema exports supported validation rules', () => {
  const schema = yep.object({
    name: yep.string().title('Nombre').required().default('Ana'),
    email: yep.string().nullable().email(),
    status: yep.string().oneOf(['A', 'I']).notOneOf(['X']),
    code: yep.string().regex(/^ABC/)
  });

  assert.deepEqual(schema.toJsonSchema(), {
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Nombre', default: 'Ana' },
      email: { type: ['string', 'null'], format: 'email' },
      status: { type: 'string', oneOf: ['A', 'I'], not: { enum: ['X'] } },
      code: { type: 'string', pattern: '^ABC' }
    },
    required: ['name']
  });
});

test('fromJsonSchema imports supported validation rules', async () => {
  const schema = yep.fromJsonSchema({
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Nombre', default: 'Ana' },
      email: { type: ['string', 'null'], format: 'email' },
      status: { type: 'string', oneOf: ['A', 'I'], not: { enum: ['X'] } },
      code: { type: 'string', pattern: '^ABC' }
    },
    required: ['code']
  });

  assert.deepEqual(
    await schema.validate({ email: null, status: 'A', code: 'ABC-1' }),
    { name: 'Ana', email: null, status: 'A', code: 'ABC-1' }
  );

  const result = await schema.validate({ code: 'invalid' }, { safe: true });
  assert.match(result.errors.code, /formato esperado/);
});

