import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('positive accepts numbers greater than zero', async () => {
  const schema = yep.number().positive();

  assert.equal(await schema.validate(1), 1);
});

test('positive rejects zero, negative and non-numeric values', async () => {
  const schema = yep.number().title('Monto').positive();

  for (const value of [0, -1, '1', Number.NaN]) {
    await assert.rejects(
      () => schema.validate(value),
      (error) => {
        assert.match(error.message, /Monto debe ser un número mayor a 0/);
        return true;
      }
    );
  }
});
