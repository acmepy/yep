import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('min and max use numeric values for number schemas', async () => {
  const schema = yep.number().label('Edad').min(0).max(10);

  assert.equal(await schema.validate(5), 5);

  for (const value of [0, 10, -1, 11]) {
    await assert.rejects(() => schema.validate(value));
  }
});

test('min and max use text length for string schemas', async () => {
  const schema = yep.string().label('Código').min(2).max(5);

  assert.equal(await schema.validate('abc'), 'abc');

  await assert.rejects(
    () => schema.validate('ab'),
    (error) => {
      assert.equal(error.message, 'Código debe tener más de 2 caracteres');
      return true;
    }
  );

  await assert.rejects(
    () => schema.validate('abcde'),
    (error) => {
      assert.equal(error.message, 'Código debe tener menos de 5 caracteres');
      return true;
    }
  );
});
