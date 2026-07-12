import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('integer accepts only integer numbers', async () => {
  const schema = yep.integer().label('Cantidad');

  for (const value of [0, 1, -10, Number.MAX_SAFE_INTEGER]) {
    assert.equal(await schema.validate(value), value);
  }

  for (const value of [1.5, NaN, Infinity, '1']) {
    await assert.rejects(
      () => schema.validate(value),
      (error) => {
        assert.equal(error.message, 'Cantidad debe ser de tipo integer');
        return true;
      }
    );
  }
});

test('integer exports and imports JSON Schema integer type', async () => {
  const schema = yep.object({
    cantidad: yep.integer().required()
  });

  assert.deepEqual(schema.toJsonSchema(), {
    type: 'object',
    properties: {
      cantidad: { type: 'integer' }
    },
    required: ['cantidad']
  });

  const imported = yep.fromJsonSchema({
    type: 'object',
    properties: {
      cantidad: { type: 'integer' }
    }
  });

  assert.deepEqual(await imported.validate({ cantidad: 3 }), { cantidad: 3 });

  const result = await imported.validate({ cantidad: 3.14 }, { safe: true });
  assert.equal(result.errors.cantidad, 'Cantidad debe ser de tipo integer');
});
