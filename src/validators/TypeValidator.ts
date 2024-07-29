import { Validator } from "../Validator";
import { throwErrorIfErrors } from "../ValidationError";
import { catchAndReturnError } from "./CatchAndReturnError";

export type AvailableTypes = "boolean" | "number" | "string" | "bigint" | "object";

/**
 * Generates a validator of an expected type.
 * Will return the original value if the type matches the expected.
 * @param expectedType
 * @returns
 */
export function typeValidator<T extends boolean | number | string | bigint | object>(expectedType: AvailableTypes): Validator<T> {
    return (key, value) => {
        if (value == null) {
            return value;
        }
        const errors: string[] = [];
        const typeofValue = typeof value;
        if(typeofValue !== expectedType) {
            errors.push(`${String(key)}: Invalid type - Expected: "${expectedType}"; Actual: "${typeofValue}"`);
        }
        throwErrorIfErrors(errors);
        return value;
    }
}

export const boolTypeValidator = typeValidator<boolean>("boolean");
export const numberTypeValidator = typeValidator<number>("number");
const stringTypeValidator = typeValidator<string>("string");

export interface NumberValidationProps {
    /**
     * The number must be at minimum this value.
     *
     * greater than or equal to.
     */
    min?: number;

    /**
     * The number must be at maximum this value.
     *
     * Less than or equal to.
     */
    max?: number;

    /**
     * The number must be an integer.
     */
    isInt?: boolean;
}

/**
 * A type validator which will check if a number and other attributes related to the number.
 */
export function numberValidator(props: NumberValidationProps = {}): Validator<number> {
    return (key, value) => {

        if (value == null) {
            return value;
        }

        const {
            isInt,
            min,
            max } = props;

        let returnValue = value;
        const errors: string[] = [];
        try {
            returnValue = numberTypeValidator(key, returnValue);
        } catch (e) {
            errors.push(...catchAndReturnError(e));
        }
        if (min && returnValue < min) {
            errors.push(`${String(key)}: Value "${returnValue}" is less than the min - Expected: >= ${min}; Actual: ${returnValue}`);
        }
        if (max && returnValue > max) {
            errors.push(`${String(key)}: Value "${returnValue}" is greater than the max - Expected: <= ${max}; Actual: ${returnValue}`);
        }

        if (isInt && !Number.isInteger(returnValue)) {
            errors.push(`${String(key)}: Value "${returnValue}" is not an integer.`);
        }

        throwErrorIfErrors(errors);

        return returnValue;
    }
}

export interface MaxLengthProps {
    /**
     * Maximum length that the string can be.
     */
    maxLength: number;

    /**
     * Whether or not the string should be trimmed rather than throwing an error.
     */
    trim?: boolean | {
        /**
         * The string to append to the end of the string.
         *
         * The final length of the trimmed string and the postfix will
         * equal the maximum length allowed.  The maximum length allowed must
         * be at least 1 character longer than the postfix.
         */
        postFix?: string;
    }
}

export interface StringValidationProps {
    /**
     * Minimum length that the string can be.
     */
    minLength?: number;
    /**
     * Maximum length that the string can be.
     */
    maxLength?: number | MaxLengthProps;
    /**
     * Transforming the string to lowercase.
     */
    transformLowercase?: true;
    /**
     * Transforming the string to uppercase.
     */
    transformUppercase?: true;
}

/**
 * A type validator which will check if a string and other attributes related to the string.
 */
export function stringValidator(props: StringValidationProps = {}): Validator<string> {
    return (key, value) => {
        const {
            minLength,
            maxLength,
            transformLowercase,
            transformUppercase } = props;

        let returnValue = value;
        const errors: string[] = [];
        try {
            returnValue = stringTypeValidator(key, returnValue);
        } catch (e) {
            errors.push(...catchAndReturnError(e));
        }
        if (returnValue == null) {
            return returnValue;
        }
        if (minLength && returnValue.length < minLength) {
            errors.push(`${String(key)}: Value "${returnValue}" outside min range - Expected: ${minLength}; Actual: ${returnValue.length}`)
        }
        if (maxLength) {
            const totalLength = typeof maxLength === "number" ? maxLength : maxLength.maxLength;
            const trim = typeof maxLength === "number" ? undefined : maxLength.trim;
            if (returnValue.length > totalLength) {
                if (trim) {
                    const postFix = typeof trim === "boolean" ? "" : trim.postFix;
                    if (totalLength < postFix.length) {
                        returnValue = postFix;
                    } else {
                        returnValue = returnValue.slice(0,  returnValue.length - postFix.length - 1) + postFix;
                    }
                }
                if (returnValue.length > totalLength) {
                    errors.push(`${String(key)}: Value "${returnValue}" outside max range - Expected: ${totalLength}; Actual: ${returnValue.length}`);
                }
            }
        }
        throwErrorIfErrors(errors);

        if (transformLowercase) {
            returnValue = returnValue.toLocaleLowerCase();
        } else if (transformUppercase) {
            returnValue = returnValue.toUpperCase();
        }

        return returnValue;
    }
}