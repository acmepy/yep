import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('required validates missing values', async () => {
  const schema = yep.object().shape({
    nombre: yep.string().label('Nombre').required()
  });

  await assert.rejects(
    () => schema.validate({}),
    (error) => {
      assert.equal(error.name, 'ValidationError');
      assert.equal(error.errors.nombre, 'Nombre es requerido');
      return true;
    }
  );
});

test('required rejects empty strings', async () => {
  const schema = yep.object({
    nombre: yep.string().label('Nombre').required()
  });

  await assert.rejects(
    () => schema.validate({ nombre: '' }),
    (error) => {
      assert.equal(error.errors.nombre, 'Nombre es requerido');
      return true;
    }
  );
});

test('default values are applied when undefined', async () => {
  const schema = yep.object().shape({
    activo: yep.boolean().default(true)
  });

  const result = await schema.validate({});
  assert.deepEqual(result, { activo: true });
});
