/**
 * A validator takes the object input and either returns the same input, a new transformed output, or
 * throws a ValidationError.
 *
 * @param key - The key attribute of the object.
 * @param value - The value that is assigned at the key attribute.
 */
export type Validator<T, R = T> = (key: string | number | symbol, value: T) => R;