import { isDate } from "../utils/IsDate";
import { Validator } from "../Validator";
import { ValidationError } from "../ValidationError";

/**
 * Converts the object from a Date to a serial value.
 */
export type DateConverter<R = number | string> = (date: Date) => R;

export const dateToISOConverter: DateConverter<string> = (date) => date.toISOString();

export function dateValidator(converter: DateConverter<string | number> = dateToISOConverter): Validator<unknown, string | number> {
    return (key, value) => {
        if (value == null) {
            return value as string | number; // Is actaully undeined or null
        }
        if (isDate(value)) {
            return converter(new Date(value));
        }
        throw new ValidationError([`${String(key)}: Value "${value}" is not a valid date.`]);
    }
}