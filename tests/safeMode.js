import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('validate supports safe mode without throwing', async () => {
  const schema = yep.object().shape({
    nombre: yep.string().label('Nombre').required(),
    edad: yep.number().label('Edad')
  });

  const result = await schema.validate({ edad: 'x' }, { safe: true });
  assert.equal(result.message, 'Se han producido 2 errores');
  assert.equal(result.errors.nombre, 'Nombre es requerido');
  assert.equal(result.errors.edad, 'Edad debe ser de tipo number');
});

test('validateAt supports safe mode without throwing', async () => {
  const schema = yep.object().shape({
    nombre: yep.string().label('Nombre').required()
  });

  const result = await schema.validateAt('nombre', {}, { safe: true });
  assert.equal(result.message, 'Nombre es requerido');
  assert.deepEqual(result.errors, { nombre: 'Nombre es requerido' });
});
