# Yep

Yep es una pequeÃƒÆ’Ã‚Â±a librerÃƒÆ’Ã‚Â­a de validaciÃƒÆ’Ã‚Â³n asÃƒÆ’Ã‚Â­ncrona para JavaScript moderno. EstÃƒÆ’Ã‚Â¡ inspirada en Yup y busca ofrecer una API encadenable, sin dependencias externas y fÃƒÆ’Ã‚Â¡cil de extender.

> Estado actual: versiÃƒÆ’Ã‚Â³n `0.1.0`, escrita como mÃƒÆ’Ã‚Â³dulos ES (`"type": "module"`).
## InstalaciÃƒÆ’Ã‚Â³n

Instala la librerÃƒÆ’Ã‚Â­a directamente desde GitHub:

```bash
npm install yep@github:acmepy/yep
```
## Uso

El proyecto todavÃƒÆ’Ã‚Â­a no define un punto de entrada publicable en `package.json`. Desde este repositorio se importa directamente el mÃƒÆ’Ã‚Â³dulo principal:

```js
import yep from 'yep';

const usuarioSchema = yep.object({
  nombre: yep.string().title('Nombre').required(),
  edad: yep.number().title('Edad'),
  email: yep.string().title('Correo').email(),
  estado: yep.string().oneOf(['A', 'I']).default('A')
});

const usuario = await usuarioSchema.validate({
  nombre: 'Ana',
  edad: 30,
  email: 'ana@example.com'
});

console.log(usuario);
// { nombre: 'Ana', edad: 30, email: 'ana@example.com', estado: 'A' }
```

`yep.object(definition)` y `yep.object().shape(definition)` son equivalentes.

## Tipos disponibles

| Constructor | Valor aceptado |
| --- | --- |
| `yep.string()` | cadenas |
| `yep.number()` | nÃƒÆ’Ã‚Âºmeros, excepto `NaN` |
| `yep.integer()` | nÃƒÆ’Ã‚Âºmeros enteros |
| `yep.boolean()` | booleanos |
| `yep.date()` | instancias vÃƒÆ’Ã‚Â¡lidas de `Date` |
| `yep.array()` | arreglos |
| `yep.objectType()` | objetos que no sean `null` ni arreglos |
| `yep.object()` | un esquema compuesto por campos |

Los tipos de campo comparten estos mÃƒÆ’Ã‚Â©todos encadenables:

- `.title(texto)`: nombre legible usado en los mensajes de error; al exportar a JSON Schema se serializa como `title`.
- `.required()`: rechaza `undefined` y cadenas vacÃƒÆ’Ã‚Â­as (`''`).
- `.nullable()`: permite `null`.
- `.default(valor)`: usa un valor por defecto cuando el campo es `undefined`.
- `.oneOf(valores)`: acepta ÃƒÆ’Ã‚Âºnicamente los valores indicados.
- `.notOneOf(valores)`: rechaza los valores indicados.
- `.regex(expresion)`: valida el valor con una expresiÃƒÆ’Ã‚Â³n regular.
- `.matches(expresion)`: alias de `.regex()`.
- `.email()`: valida un formato bÃƒÆ’Ã‚Â¡sico de correo electrÃƒÆ’Ã‚Â³nico.
- `.positive()`: acepta ÃƒÆ’Ã‚Âºnicamente nÃƒÆ’Ã‚Âºmeros mayores que `0`.
- `.min(lÃƒÆ’Ã‚Â­mite)`: exige un nÃƒÆ’Ã‚Âºmero mayor al lÃƒÆ’Ã‚Â­mite o un texto con mÃƒÆ’Ã‚Â¡s caracteres que el lÃƒÆ’Ã‚Â­mite.
- `.max(lÃƒÆ’Ã‚Â­mite)`: exige un nÃƒÆ’Ã‚Âºmero menor al lÃƒÆ’Ã‚Â­mite o un texto con menos caracteres que el lÃƒÆ’Ã‚Â­mite.

Las validaciones son asÃƒÆ’Ã‚Â­ncronas, por lo que `validate` y `validateAt` siempre deben usarse con `await`.

## Errores de validaciÃƒÆ’Ã‚Â³n

Por defecto, `validate` reÃƒÆ’Ã‚Âºne los errores de todos los campos y lanza un `ValidationError`:

```js
try {
  await usuarioSchema.validate({ edad: 'treinta' });
} catch (error) {
  console.log(error.toJSON());
}
```

La representaciÃƒÆ’Ã‚Â³n del error tiene esta forma:

```js
{
  name: 'ValidationError',
  status: 400,
  code: 'VALIDATION_ERROR',
  message: 'Se han producido 2 errores',
  errors: {
    nombre: 'Nombre es requerido',
    edad: 'Edad debe ser de tipo number'
  }
}
```

Si un campo incumple varias reglas, sus mensajes se concatenan con ` | `.

### Modo seguro

La opciÃƒÆ’Ã‚Â³n `{ safe: true }` devuelve el mismo resumen sin lanzar una excepciÃƒÆ’Ã‚Â³n:

```js
const result = await usuarioSchema.validate(
  { edad: 'treinta' },
  { safe: true }
);

if (result.errors) {
  console.log(result.errors);
}
```

Cuando la validaciÃƒÆ’Ã‚Â³n es correcta, el resultado sigue siendo el objeto validado.

## Validar un solo campo

```js
const nombre = await usuarioSchema.validateAt('nombre', {
  nombre: 'JosÃƒÆ’Ã‚Â©'
});

const result = await usuarioSchema.validateAt(
  'nombre',
  {},
  { safe: true }
);
```

Si el campo no existe en el esquema, `validateAt` devuelve `undefined`.

## Requerir al menos uno de varios campos

```js
const contactoSchema = yep.object({
  email: yep.string().title('Correo').email(),
  telefono: yep.string().title('TelÃƒÆ’Ã‚Â©fono')
}).requiredOneOf(['email', 'telefono']);

await contactoSchema.validate({ telefono: '0981000000' });

const resultado = await contactoSchema.validate({}, { safe: true });

console.log(resultado);
// {
//   message: 'Se ha producido 1 error',
//   errors: {
//     email: 'Debe completar al menos uno de los campos: Correo, TelÃƒÆ’Ã‚Â©fono'
//     telefono: 'Debe completar al menos uno de los campos: Correo, TelÃƒÆ’Ã‚Â©fono'
//   }
// }
```

La regla considera vacÃƒÆ’Ã‚Â­o un valor `undefined`, `null` o `''`. Si ninguno estÃƒÆ’Ã‚Â¡ presente, el error se asigna al primer campo de la lista.

## Validadores personalizados

`addTest` registra una regla encadenable para esquemas de texto. La funciÃƒÆ’Ã‚Â³n recibe `(value, fieldName, data, options)` y puede devolver un booleano o una promesa de booleano:

```js
yep.addTest(
  'ruc',
  (value) => /^\d+-\d$/.test(value),
  {
    message: ({ title }) => `${title} no tiene un formato vÃƒÆ’Ã‚Â¡lido`
  }
);

const schema = yep.object({
  ruc: yep.string().title('RUC').ruc()
});

await schema.validate({ ruc: '123-4' });
```

La opciÃƒÆ’Ã‚Â³n `message` puede ser una funciÃƒÆ’Ã‚Â³n que recibe `{ title }`. Si se omite, se usa el mensaje genÃƒÆ’Ã‚Â©rico de validaciÃƒÆ’Ã‚Â³n personalizada.

## ConversiÃƒÆ’Ã‚Â³n desde y hacia JSON Schema

```js
const jsonSchema = usuarioSchema.toJsonSchema();
// TambiÃƒÆ’Ã‚Â©n: yep.toJsonSchema(usuarioSchema)

const schema = yep.fromJsonSchema({
  type: 'object',
  properties: {
    nombre: { type: 'string' },
    estado: { type: 'string', oneOf: ['A', 'I'] }
  }
});
```

La conversiÃƒÂ³n implementa un subconjunto de JSON Schema: `type`, `title`, objetos con `properties`, `required`, tipos anulables, `default`, `oneOf`, `not.enum`, `pattern` y el formato `email`. `title` se importa/exporta como el `title` del campo. Los tests personalizados y `requiredOneOf` no se conservan porque no tienen una representaciÃƒÂ³n JSON Schema equivalente directa.
equired, tipos anulables, default, oneOf, 
ot.enum, pattern y el formato email. 	itle se importa/exporta como el title del campo. Los tests personalizados y 
equiredOneOf no se conservan porque no tienen una representaciÃƒÆ’Ã‚Â³n JSON Schema equivalente directa.

## API resumida

```js
yep.object(definition)
yep.string()
yep.number()
yep.integer()
yep.boolean()
yep.date()
yep.array()
yep.objectType()
yep.validate(schema, data)
yep.toJsonSchema(schema)
yep.fromJsonSchema(jsonSchema)
yep.addTest(name, fn, options)
yep.addType(name, type)
```

`addType` registra una fÃƒÆ’Ã‚Â¡brica interna por nombre para que pueda ser utilizada al convertir un JSON Schema. No crea automÃƒÆ’Ã‚Â¡ticamente un nuevo mÃƒÆ’Ã‚Â©todo en el objeto `yep`.

## Desarrollo

No hay dependencias de ejecuciÃƒÆ’Ã‚Â³n. Para ejecutar la suite con el runner nativo de Node.js:

```bash
npm test
```

Para ejecutar el ejemplo incluido:

```bash
npm run usage
```

