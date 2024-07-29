import { catchAndReturnError } from "./CatchAndReturnError";
import { throwErrorIfErrors } from "../ValidationError";
import { Validator } from "../Validator";

export function orValidator<T>(...validators: Validator<T>[]): Validator<T> {
    return (key, value) => {
        const errors: string[] = [];
        for (const validator of validators) {
            try {
                return validator(key, value);
            } catch (e) {
                errors.push(catchAndReturnError(e).join("\n"));
            }
        }
        throwErrorIfErrors([`"${errors.join('" OR "')}"`]);
        return value;
    }
}