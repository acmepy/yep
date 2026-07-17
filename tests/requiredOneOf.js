import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('requiredOneOf validates one of several fields', async () => {
  const schema = yep.object().shape({
    email: yep.string().title('Email'),
    telefono: yep.string().title('Teléfono')
  }).requiredOneOf(['email', 'telefono']);

  await assert.rejects(
    () => schema.validate({}),
    (error) => {
      assert.equal(error.message, 'Se han producido 2 errores');
      assert.equal(error.errors.email, 'Debe completar al menos uno de los campos: Email, Teléfono');
      assert.equal(error.errors.telefono, 'Debe completar al menos uno de los campos: Email, Teléfono');
      return true;
    }
  );
});
