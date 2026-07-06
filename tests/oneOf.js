import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('oneOf validates allowed values', async () => {
  const schema = yep.object().shape({
    estado: yep.string().oneOf(['A', 'I'])
  });

  const result = await schema.validate({ estado: 'A' });
  assert.deepEqual(result, { estado: 'A' });
});

test('notOneOf rejects forbidden values', async () => {
  const schema = yep.object().shape({
    estado: yep.string().notOneOf(['X'])
  });

  await assert.rejects(
    () => schema.validate({ estado: 'X' }),
    (error) => {
      assert.equal(error.errors.estado, 'Estado no puede ser uno de los valores permitidos');
      return true;
    }
  );
});
