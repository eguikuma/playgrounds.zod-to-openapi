export const hasProperty = <T extends object = object>(
  object: T,
  property: keyof T,
): property is keyof T =>
  Object.prototype.hasOwnProperty.call(object, property);
