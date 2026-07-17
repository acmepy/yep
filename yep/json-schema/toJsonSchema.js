export function toJsonSchema(schema) {
  if (!schema) {
    return {};
  }

  if (schema.shapeDefinition) {
    const jsonSchema = {
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(schema.shapeDefinition).map(([key, value]) => [key, toJsonSchema(value)])
      )
    };
    const required = Object.entries(schema.shapeDefinition)
      .filter(([, value]) => value?.requiredFlag)
      .map(([key]) => key);
    if (required.length > 0) {
      jsonSchema.required = required;
    }
    return jsonSchema;
  }

  const jsonSchema = {
    type: schema.nullableFlag
      ? [schema.typeName, 'null']
      : schema.typeName
  };
  if (schema.titleText) jsonSchema.title = schema.titleText;
  if (schema.defaultValue !== undefined) jsonSchema.default = schema.defaultValue;
  if (schema.oneOfValues) jsonSchema.oneOf = schema.oneOfValues;
  if (schema.notOneOfValues) jsonSchema.not = { enum: schema.notOneOfValues };
  if (schema.regexPattern) jsonSchema.pattern = schema.regexPattern.source;
  if (schema.tests?.some((test) => test.name === 'email')) jsonSchema.format = 'email';
  return jsonSchema;
}

export default toJsonSchema;

