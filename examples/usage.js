import yep from '../yep/index.js';

const schema = yep.object().shape({
  nombre: yep.string().label('Nombre').required(),
  edad: yep.number().label('Edad').required(),
  email: yep.string().email().label('Correo electrónico').nullable(),
  estado: yep.string().oneOf(['A', 'I'])
});

console.log(1, await schema.validate({ nombre: 'Juan', edad:25}, { safe: true }));
console.log(2, await schema.validate({ nombre: 'Juan', email:'dfsdfgsdfg'}, { safe: true }));
console.log(3, await schema.validate({}, { safe: true }));

try {
  await schema.validate({});
} catch (error) {
  console.log(4, error.toJSON());
}

console.log(5, await schema.validateAt('nombre', { nombre: '' }, { safe: true }));//'' debe ser nulo tambien
const jsonSchema = schema.toJsonSchema()
console.log(6, jsonSchema);

const schema2= yep.fromJsonSchema(jsonSchema);
console.log(7, await schema2.validate({ nombre: 'Juan' }, {safe: true}));

yep.addTest('ruc', (value) => /^\d+-\d$/.test(value), {
  message: ({ label }) => `${label} no tiene un formato válido`
});

const rucSchema = yep.object().shape({
  ruc: yep.string().label('RUC').ruc()
});

console.log(await rucSchema.validate({ ruc: '123' }, {safe: true}));
