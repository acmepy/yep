import test from 'node:test';
import assert from 'node:assert/strict';
import yep from '../yep/index.js';

test('min and max use numeric values for number schemas', async () => {
  const schema = yep.number().title('Edad').min(0).max(10);

  for (const value of [0, 5, 10]) {
    assert.equal(await schema.validate(value), value);
  }

  await assert.rejects(
    () => schema.validate(-1),
    (error) => {
      assert.equal(error.message, 'Edad debe ser mayor o igual a 0');
      return true;
    }
  );

  await assert.rejects(
    () => schema.validate(11),
    (error) => {
      assert.equal(error.message, 'Edad debe ser menor o igual a 10');
      return true;
    }
  );
});

test('min and max use text length for string schemas', async () => {
  const schema = yep.string().title('Código').min(3).max(5);

  for (const value of ['abc', 'abcde']) {
    assert.equal(await schema.validate(value), value);
  }

  await assert.rejects(
    () => schema.validate('ab'),
    (error) => {
      assert.equal(error.message, 'Código debe tener al menos 3 caracteres');
      return true;
    }
  );

  await assert.rejects(
    () => schema.validate('abcdef'),
    (error) => {
      assert.equal(error.message, 'Código debe tener como máximo 5 caracteres');
      return true;
    }
  );
});

test('min and max use date values for date schemas', async () => {
  const minDate = new Date('2024-01-01T00:00:00.000Z');
  const maxDate = new Date('2024-01-31T00:00:00.000Z');
  const schema = yep.date().title('Fecha').min(minDate).max(maxDate);

  const validDate = new Date('2024-01-15T00:00:00.000Z');
  assert.equal((await schema.validate(validDate)).getTime(), validDate.getTime());

  await assert.rejects(
    () => schema.validate(new Date('2023-12-31T23:59:59.999Z')),
    (error) => {
      assert.equal(error.message, 'Fecha debe ser mayor o igual a 2024-01-01T00:00:00.000Z');
      return true;
    }
  );

  await assert.rejects(
    () => schema.validate(new Date('2024-02-01T00:00:00.000Z')),
    (error) => {
      assert.equal(error.message, 'Fecha debe ser menor o igual a 2024-01-31T00:00:00.000Z');
      return true;
    }
  );
});

test('between uses first value as min and second value as max', async () => {
  const schema = yep.number().title('Edad').between(18, 65);

  for (const value of [18, 30, 65]) {
    assert.equal(await schema.validate(value), value);
  }

  await assert.rejects(
    () => schema.validate(17),
    (error) => {
      assert.equal(error.message, 'Edad debe ser mayor o igual a 18');
      return true;
    }
  );

  await assert.rejects(
    () => schema.validate(66),
    (error) => {
      assert.equal(error.message, 'Edad debe ser menor o igual a 65');
      return true;
    }
  );
});
