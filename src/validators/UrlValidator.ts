import { Validator } from "../Validator";
import { ValidationError } from "../ValidationError";

/**
 * Generates a validator of an expected type.
 * Will return the original value if the type matches the expected.
 * @param expectedType
 * @returns
 */
export function urlValidator<T extends string | URL>(): Validator<T, string> {
    return (key, value) => {
        if (value == null) {
            return value as null;
        }
        const errors: string[] = [];
        try {
            return new URL(value).href;
        } catch (e) {
            errors.push(`${String(key)}: Value "${value}" is not a valid URL.`);
        }
        throw new ValidationError(errors);
        // throwErrorIfErrors(errors);
    }
}