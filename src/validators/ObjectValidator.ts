import { uniquify } from "../utils/Uniquify";
import { StringKeys } from "../types/StringKeys";
import { throwErrorIfErrors, ValidationError } from "../ValidationError";
import { ClonableValidator } from "./CloneableValidator";
import { Validator } from "../Validator";

export type ValidationObject<T extends object> = Record<StringKeys<T>, Validator<unknown, unknown>>;

export interface Options {
    /**
     * If true, only the attributes that are given in the object will be validated.
     */
    ignoreUnknownAttributes?: boolean;
    /**
     * If true, only the attributes that are given in the object will be validated.
     *
     * For example: This means if an attribute is "required" but is not included in the object, then the attribute will pass.
     */
    validateOnlyAvailableAttributes?: boolean;
}

export interface ObjectValidator<T extends object, UpdatedT extends object = T> extends ClonableValidator<T, UpdatedT, Options, ObjectValidator<T, UpdatedT>> {
    validationObject: ValidationObject<T>;
}

export function objectValidator<T extends object, UpdatedT extends object = T>(validationObj: ValidationObject<T>, options: Options = {}): ObjectValidator<T, UpdatedT> {
    const keysInValidation = Object.keys(validationObj) as StringKeys<T>[];
    const {
        ignoreUnknownAttributes = false,
        validateOnlyAvailableAttributes = false
     } = options;
    const objectValidatorFunction: Validator<T, UpdatedT> = function(key, objectToValidate) {
        if (objectToValidate == null) {
            return (objectToValidate as unknown) as UpdatedT;
        }
        if (typeof objectToValidate !== "object") {
            throw new ValidationError([`${String(key)}: Value is not an object; Received - ${typeof objectToValidate}`]);
        }
        const caughtErrors: string[] = [];
        const keysInObject = Object.keys(objectToValidate) as StringKeys<T>[];
        // There are elements in both the ValidationObject and the ObjectToValidate which need validation.
        // For example, required elements may be missing in the ObjectToValidate which means they need to be validated.
        // So combining both attributes will cover everything.  Uniquify them to ensure that get validated once.
        const totalKeys: StringKeys<T>[] = validateOnlyAvailableAttributes ?
            keysInObject :
            uniquify(keysInObject.concat(keysInValidation)) as StringKeys<T>[];

        for (const key of totalKeys) {
            caughtErrors.push(...findErrorsOrTransform(validationObj, objectToValidate, key, ignoreUnknownAttributes));
        }
        throwErrorIfErrors(caughtErrors.map(e => `${String(key)}.${e}`));
        return (objectToValidate as unknown) as UpdatedT;
    };

    (objectValidatorFunction as ObjectValidator<T, UpdatedT>).clone = (options?: Options) => objectValidator(validationObj, options);
    (objectValidatorFunction as ObjectValidator<T, UpdatedT>).validationObject = validationObj;

    return objectValidatorFunction as ObjectValidator<T, UpdatedT>;
}

/**
 * possible keys
 *
 * "key"
 * "key[0]"
 */
const keyRegex = /([^[\]]+)(\[[0-9]+])?/

function findErrorsOrTransform<T extends object>(validationObj: ValidationObject<T>, objToValidate: unknown, key: StringKeys<T>, ignoreUnknown: boolean): string[] {
    let caughtError: Error;
    try {
        const keyMatch = key.match(keyRegex);
        const keyToUse: StringKeys<T> = keyMatch ? keyMatch[1] as StringKeys<T> : key;
        const validator = validationObj[keyToUse];
        if (validator) {
            // Thanks to the wonders of Javascirpt, if key has an array at the end, then the object that gets validated is
            // only the requested index.
            objToValidate[keyToUse] = validator(key, objToValidate[key]);
        } else if (ignoreUnknown === false) {
            throw new ValidationError([`${String(key)}: Unknown attribute`])
        }
    } catch (e) {
        caughtError = e;
    }
    if (caughtError instanceof ValidationError) {
        return caughtError.errors.map((e) => `${e}`);
    } else if (caughtError) {
        return [`${String(key)}: ${caughtError.message}`];
    }
    return [];
}