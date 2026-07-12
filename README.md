# Yep

Yep es una pequeña librería de validación asíncrona para JavaScript moderno. Está inspirada en Yup y busca ofrecer una API encadenable, sin dependencias externas y fácil de extender.

> Estado actual: versión `0.1.0`, escrita como módulos ES (`"type": "module"`).
## Instalación

Instala la librería directamente desde GitHub:

```bash
npm install yep@github:acmepy/yep
```
## Uso

El proyecto todavía no define un punto de entrada publicable en `package.json`. Desde este repositorio se importa directamente el módulo principal:

```js
import yep from 'yep';

const usuarioSchema = yep.object({
  nombre: yep.string().label('Nombre').required(),
  edad: yep.number().label('Edad'),
  email: yep.string().label('Correo').email(),
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
| `yep.number()` | números, excepto `NaN` |
| `yep.integer()` | números enteros |
| `yep.boolean()` | booleanos |
| `yep.date()` | instancias válidas de `Date` |
| `yep.array()` | arreglos |
| `yep.objectType()` | objetos que no sean `null` ni arreglos |
| `yep.object()` | un esquema compuesto por campos |

Los tipos de campo comparten estos métodos encadenables:

- `.label(texto)`: nombre legible usado en los mensajes de error.
- `.required()`: rechaza `undefined` y cadenas vacías (`''`).
- `.nullable()`: permite `null`.
- `.default(valor)`: usa un valor por defecto cuando el campo es `undefined`.
- `.oneOf(valores)`: acepta únicamente los valores indicados.
- `.notOneOf(valores)`: rechaza los valores indicados.
- `.regex(expresion)`: valida el valor con una expresión regular.
- `.matches(expresion)`: alias de `.regex()`.
- `.email()`: valida un formato básico de correo electrónico.
- `.positive()`: acepta únicamente números mayores que `0`.
- `.min(límite)`: exige un número mayor al límite o un texto con más caracteres que el límite.
- `.max(límite)`: exige un número menor al límite o un texto con menos caracteres que el límite.

Las validaciones son asíncronas, por lo que `validate` y `validateAt` siempre deben usarse con `await`.

## Errores de validación

Por defecto, `validate` reúne los errores de todos los campos y lanza un `ValidationError`:

```js
try {
  await usuarioSchema.validate({ edad: 'treinta' });
} catch (error) {
  console.log(error.toJSON());
}
```

La representación del error tiene esta forma:

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

La opción `{ safe: true }` devuelve el mismo resumen sin lanzar una excepción:

```js
const result = await usuarioSchema.validate(
  { edad: 'treinta' },
  { safe: true }
);

if (result.errors) {
  console.log(result.errors);
}
```

Cuando la validación es correcta, el resultado sigue siendo el objeto validado.

## Validar un solo campo

```js
const nombre = await usuarioSchema.validateAt('nombre', {
  nombre: 'José'
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
  email: yep.string().label('Correo').email(),
  telefono: yep.string().label('Teléfono')
}).requiredOneOf(['email', 'telefono']);

await contactoSchema.validate({ telefono: '0981000000' });

const resultado = await contactoSchema.validate({}, { safe: true });

console.log(resultado);
// {
//   message: 'Se ha producido 1 error',
//   errors: {
//     email: 'Debe completar al menos uno de los campos: Correo, Teléfono'
//     telefono: 'Debe completar al menos uno de los campos: Correo, Teléfono'
//   }
// }
```

La regla considera vacío un valor `undefined`, `null` o `''`. Si ninguno está presente, el error se asigna al primer campo de la lista.

## Validadores personalizados

`addTest` registra una regla encadenable para esquemas de texto. La función recibe `(value, fieldName, data, options)` y puede devolver un booleano o una promesa de booleano:

```js
yep.addTest(
  'ruc',
  (value) => /^\d+-\d$/.test(value),
  {
    message: ({ label }) => `${label} no tiene un formato válido`
  }
);

const schema = yep.object({
  ruc: yep.string().label('RUC').ruc()
});

await schema.validate({ ruc: '123-4' });
```

La opción `message` puede ser una función que recibe `{ label }`. Si se omite, se usa el mensaje genérico de validación personalizada.

## Conversión desde y hacia JSON Schema

```js
const jsonSchema = usuarioSchema.toJsonSchema();
// También: yep.toJsonSchema(usuarioSchema)

const schema = yep.fromJsonSchema({
  type: 'object',
  properties: {
    nombre: { type: 'string' },
    estado: { type: 'string', oneOf: ['A', 'I'] }
  }
});
```

La conversión implementa un subconjunto de JSON Schema: `type`, objetos con `properties`, `required`, tipos anulables, `default`, `oneOf`, `not.enum`, `pattern` y el formato `email`. Los tests personalizados y `requiredOneOf` no se conservan porque no tienen una representación JSON Schema equivalente directa.

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

`addType` registra una fábrica interna por nombre para que pueda ser utilizada al convertir un JSON Schema. No crea automáticamente un nuevo método en el objeto `yep`.

## Desarrollo

No hay dependencias de ejecución. Para ejecutar la suite con el runner nativo de Node.js:

```bash
npm test
```

Para ejecutar el ejemplo incluido:

```bash
npm run usage
```
