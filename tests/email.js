import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('email validates basic email format', async () => {
  const schema = yep.object().shape({
    email: yep.string().label('Email').email()
  });

  const valid = await schema.validate({ email: 'test@example.com' });
  assert.deepEqual(valid, { email: 'test@example.com' });
});

test('email rejects invalid email format', async () => {
  const schema = yep.object().shape({
    email: yep.string().label('Email').email()
  });

  await assert.rejects(
    () => schema.validate({ email: 'invalid-email' }),
    (error) => {
      assert.equal(error.errors.email, 'Email no tiene un formato de correo válido');
      return true;
    }
  );
});
