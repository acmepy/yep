import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('regex validates pattern', async () => {
  const schema = yep.object().shape({
    ruc: yep.string().label('RUC').regex(/^\d+-\d$/)
  });

  const result = await schema.validate({ ruc: '123-4' });
  assert.deepEqual(result, { ruc: '123-4' });
});

test('regex rejects invalid pattern', async () => {
  const schema = yep.object().shape({
    ruc: yep.string().label('RUC').regex(/^\d+-\d$/)
  });

  await assert.rejects(
    () => schema.validate({ ruc: 'abc' }),
    (error) => {
      assert.equal(error.errors.ruc, 'RUC no cumple con el formato esperado');
      return true;
    }
  );
});
