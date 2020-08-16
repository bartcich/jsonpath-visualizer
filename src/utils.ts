export const isArray = (obj: any): boolean => {
  return Array.isArray(obj);
};

export const isObject = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

const primitiveTypes = ["undefined", "boolean", "number", "string", "bigint"];

export const isPrimitive = (obj: any): boolean => {
  return primitiveTypes.indexOf(typeof obj) >= 0;
};
