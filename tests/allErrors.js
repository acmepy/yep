import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('validate collects multiple field errors in one run', async () => {
  const schema = yep.object().shape({
    nombre: yep.string().label('Nombre').required(),
    edad: yep.number().label('Edad'),
    estado: yep.string().label('Estado').oneOf(['A', 'I']).regex(/^[A-Z]+$/)
  });

  await assert.rejects(
    () => schema.validate({ edad: 'x', estado: '1' }),
    (error) => {
      assert.equal(error.name, 'ValidationError');
      assert.equal(error.message, 'Se han producido 3 errores');
      assert.equal(error.errors.nombre, 'Nombre es requerido');
      assert.equal(error.errors.edad, 'Edad debe ser de tipo number');
      assert.ok(error.errors.estado.includes('Estado debe ser uno de los valores permitidos'));
      assert.ok(error.errors.estado.includes('Estado no cumple con el formato esperado'));
      return true;
    }
  );
});
