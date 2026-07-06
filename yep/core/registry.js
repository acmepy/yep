const registry = {
  types: new Map(),
  tests: new Map()
};

export function registerType(name, isValidType) {
  registry.types.set(name, isValidType);
}

export function registerTest(name, fn, options = {}) {
  registry.tests.set(name, { fn, options });
}

export function getType(name) {
  return registry.types.get(name);
}

export function getTest(name) {
  return registry.tests.get(name);
}

export function getRegisteredTypes() {
  return [...registry.types.keys()];
}

export default registry;
