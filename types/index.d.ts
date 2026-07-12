export type MaybePromise<T> = T | Promise<T>;

export interface ValidationSummary {
  message: string;
  errors: Record<string, string>;
}

export interface ValidationOptions {
  safe?: boolean;
}

export interface TestMessageContext {
  label: string;
}

export interface TestOptions {
  label?: string;
  message?: (context: TestMessageContext) => string;
  [key: string]: unknown;
}

export type TestFunction<T = unknown> = (
  value: T,
  fieldName: string,
  data: Record<string, unknown>,
  options: TestOptions
) => MaybePromise<boolean>;

export interface JsonSchema {
  type?: string | string[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
  oneOf?: unknown[];
  enum?: unknown[];
  not?: JsonSchema;
  default?: unknown;
  pattern?: string;
  format?: string;
  [key: string]: unknown;
}

export interface BaseSchema<T = unknown> {
  readonly typeName: string;
  label(text: string): this;
  required(options?: TestOptions): this;
  nullable(options?: TestOptions): BaseSchema<T | null>;
  default(value: T): this;
  oneOf(values: readonly T[], options?: TestOptions): this;
  notOneOf(values: readonly T[], options?: TestOptions): this;
  regex(pattern: RegExp, options?: TestOptions): this;
  matches(pattern: RegExp, options?: TestOptions): this;
  email(options?: TestOptions): this;
  positive(options?: TestOptions): this;
  min(limit: number, options?: TestOptions): this;
  max(limit: number, options?: TestOptions): this;
  addTest(name: string, fn: TestFunction<T>, options?: TestOptions): this;
  validate(value: unknown, data?: Record<string, unknown>): Promise<T | null | undefined>;
  toJsonSchema(): JsonSchema;

  // Los tests registrados con yep.addTest() se agregan dinámicamente.
  [testName: string]: any;
}

export type SchemaShape = Record<string, BaseSchema<any>>;

export type InferSchema<TSchema> =
  TSchema extends BaseSchema<infer TValue> ? TValue :
  TSchema extends ObjectSchema<infer TShape> ? InferShape<TShape> :
  never;

export type InferShape<TShape extends SchemaShape> = {
  [TKey in keyof TShape]: InferSchema<TShape[TKey]>;
};

export interface ObjectSchema<TShape extends SchemaShape = SchemaShape> {
  shape<TNextShape extends SchemaShape>(definition: TNextShape): ObjectSchema<TNextShape>;
  requiredOneOf(fields: readonly (keyof TShape & string)[]): this;
  validate(
    data?: Partial<InferShape<TShape>>,
    options?: ValidationOptions
  ): Promise<InferShape<TShape> | ValidationSummary>;
  validateAt<TKey extends keyof TShape>(
    field: TKey,
    data?: Partial<InferShape<TShape>>,
    options?: ValidationOptions
  ): Promise<InferSchema<TShape[TKey]> | ValidationSummary | undefined>;
  toJsonSchema(): JsonSchema;
}

export type AnySchema = BaseSchema<any> | ObjectSchema<any>;

export interface Yep {
  object<TShape extends SchemaShape = SchemaShape>(definition?: TShape): ObjectSchema<TShape>;
  string(): BaseSchema<string>;
  number(): BaseSchema<number>;
  integer(): BaseSchema<number>;
  boolean(): BaseSchema<boolean>;
  date(): BaseSchema<Date>;
  array(): BaseSchema<unknown[]>;
  objectType(): BaseSchema<Record<string, unknown>>;
  addTest<T = unknown>(name: string, fn: TestFunction<T>, options?: TestOptions): this;
  addType<TName extends string, TValue = unknown>(
    name: TName,
    isValidType: (value: unknown) => boolean
  ): this & Record<TName, () => BaseSchema<TValue>>;
  fromJsonSchema(schema: JsonSchema): AnySchema;
  toJsonSchema(schema: AnySchema): JsonSchema;
  validate<T>(schema: BaseSchema<T>, data: unknown): Promise<T | null | undefined>;
  validate<TShape extends SchemaShape>(
    schema: ObjectSchema<TShape>,
    data: Partial<InferShape<TShape>>
  ): Promise<InferShape<TShape> | ValidationSummary>;
}

declare const yep: Yep;

export default yep;
