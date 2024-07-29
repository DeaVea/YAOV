import { catchAndReturnError } from "./CatchAndReturnError";
import { throwErrorIfErrors } from "../ValidationError";
import { Validator } from "../Validator";
import { ClonableValidator } from "./CloneableValidator";

export type AndValidator<T, UpdatedT = T> = ClonableValidator<T, UpdatedT, Validator<T, UpdatedT>[], AndValidator<T, UpdatedT>>;

export type ValidatorsType<T, UpdatedT> = Validator<T> | Validator<T, UpdatedT> | Validator<UpdatedT>;

export function andValidator<T, UpdatedT>(...validators: ValidatorsType<T, UpdatedT>[]): AndValidator<T, UpdatedT> {
    const partialAndvalidator: Validator<T, UpdatedT> = function(key, value) {
        let valueToReturn: T | UpdatedT = value;
        for (const validator of validators) {
            try {
                valueToReturn = validator(key, valueToReturn as T & UpdatedT) as UpdatedT;
            } catch (e) {
                const foundErrors = catchAndReturnError(e);
                throwErrorIfErrors(foundErrors);
            }
        }
        return valueToReturn as UpdatedT;
    };
    const clone = (newValidators: ValidatorsType<T, UpdatedT>[] = []) => andValidator<T, UpdatedT>(...validators, ...newValidators);
    return Object.assign(partialAndvalidator, { clone }) as AndValidator<T, UpdatedT>;
}