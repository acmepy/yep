import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('nullable allows null values', async () => {
  const schema = yep.object().shape({
    descripcion: yep.string().nullable()
  });

  const result = await schema.validate({ descripcion: null });
  assert.deepEqual(result, { descripcion: null });
});

test('nullable is rejected when not set', async () => {
  const schema = yep.object().shape({
    descripcion: yep.string()
  });

  await assert.rejects(
    () => schema.validate({ descripcion: null }),
    (error) => {
      assert.equal(error.errors.descripcion, 'Descripcion debe ser de tipo string');
      return true;
    }
  );
});
