import { throwErrorIfErrors, ValidationError } from "../ValidationError";
import { Validator } from "../Validator";

const indexKeyRegex = /([^[\]]+)(\[([0-9]+)])/

export interface ArrayLimitations {
    maxLength?: number;
}

export function arrayValidator<T>(itemValidator: Validator<unknown>, arrayLimitations: ArrayLimitations = {}): Validator<T> {
    return (key, value) => {
        if (!value) {
            return value;
        }

        const caughtErrors: string[] = [];
        // Check if we're only going to check a single value.
        const indexKeyMatch = key.toString().match(indexKeyRegex);
        if (indexKeyMatch) {
            // This is an index key in the form "<key>[<index>]".  Just check the single object against the value.
            try {
                value = itemValidator(key, value) as T;
            } catch(e) {
                if (e instanceof ValidationError) {
                    caughtErrors.push(...e.errors.map(e => `${e}`));
                } else {
                    caughtErrors.push(`${String(key)}: ${e.message}`);
                }
            }
        }
        else {
            if (!Array.isArray(value)) {
                throw new ValidationError([`${String(key)}: Not an array; Received: ${typeof value}`])
            }

            if (arrayLimitations.maxLength >= 0) {
                if (arrayLimitations.maxLength < value.length) {
                    throw new ValidationError([`${String(key)}: Array is too long. Limit: ${arrayLimitations.maxLength}; Received: ${value.length}`]);
                }
            }

            for (let i = 0; i < value.length; ++i) {
                const itemValue = value[i];
                try {
                    value[i] = itemValidator(i, itemValue);
                } catch (e) {
                    if (e instanceof ValidationError) {
                        caughtErrors.push(...e.errors.map(e => `${String(key)}.${e}`));
                    } else {
                        caughtErrors.push(`${String(key)}.${String(i)}: ${e.message}`);
                    }
                }
            }
        }
        throwErrorIfErrors(caughtErrors);
        return value;
    }
}