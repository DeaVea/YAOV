import { ValidationError } from "../ValidationError";
import { Validator } from "../Validator";

export function requiredValidator<T = unknown>(): Validator<T> {
    return (key, value) => {
        if (value == null) {
            throw new ValidationError([`${String(key)}: Value was not defined but is required.`])
        }
        return value;
    };
}