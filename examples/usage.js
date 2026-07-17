import yep from 'yep';

const schema = yep.object().shape({
  nombre: yep.string().title('Nombre').required().min(5).max(20),
  edad: yep.number().title('Edad').required().positive().min(10).max(50),
  cantidad: yep.integer().title('Cantidad').required().min(1).max(10),
  email: yep.string().email().title('Correo electrónico').nullable(),
  phone: yep.string().title('Teléfono').matches(/^\d{3}-\d{3}-\d{4}$/).nullable(),
  estado: yep.string().oneOf(['A', 'I'])
});

console.log(1, await schema.validate({ nombre: 'Juan', edad:-25}, { safe: true }));
console.log(2, await schema.validate({ nombre: 'Juan', email:'dfsdfgsdfg'}, { safe: true }));
console.log(3, await schema.validate({}, { safe: true }));

try {
  await schema.validate({});
} catch (error) {
  console.log(4, error.toJSON());
}

console.log(5, await schema.validateAt('nombre', { nombre: '' }, { safe: true }));
console.log(6, await schema.validateAt('edad', { edad: 2 }, { safe: true }));
console.log(7, await schema.validateAt('edad', { edad: 51 }, { safe: true }));
console.log(8, await schema.validateAt('phone', { phone: "123456a" }, { safe: true }));
console.log(8.1, await schema.validateAt('cantidad', { cantidad: 2.5 }, { safe: true }));
const jsonSchema = schema.toJsonSchema()
console.log(9, jsonSchema);

const schema2= yep.fromJsonSchema(jsonSchema);
console.log(10, await schema2.validate({ nombre: 'Juan' }, {safe: true}));

yep.addTest('ruc', (value) => /^\d+-\d$/.test(value), {
  message: ({ title }) => `${title} no tiene un formato válido`
});

const rucSchema = yep.object().shape({
  ruc: yep.string().title('RUC').ruc()
});

console.log(11, await rucSchema.validate({ ruc: '123' }, {safe: true}));

const contactSchema = yep.object({
  email: yep.string().title('Correo electrónico').email(),
  phone: yep.string().title('Teléfono').matches(/^\d{3}-\d{3}-\d{4}$/)
}).requiredOneOf(['email', 'phone']);

console.log(12, await contactSchema.validate({ phone: '123-456-7890' }));
console.log(13, await contactSchema.validate({}, { safe: true }));
