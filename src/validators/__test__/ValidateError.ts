import { ValidationError } from "../../ValidationError";
import { Validator } from "../../Validator";

/**
 *
 * @param validator
 * @param testValue
 * @param expectedErrors
 * @param couldBeMoreErrors Set to true if there could be more errors that are a result of this error. If this is set to true, then only the subset
 * of expected errors will be checked.  Any additional errors will be ignored.
 */
export function validateError(validator: Validator<unknown>, testValue: unknown, expectedErrors: string[], couldBeMoreErrors: boolean = false) {
    let caughtError: ValidationError;
    try {
        validator("TestAttrib", testValue);
    } catch (e) {
        caughtError = e;
    }
    expect(caughtError).toBeInstanceOf(ValidationError);
    if (couldBeMoreErrors) {
        for (const expectedError of expectedErrors) {
            expect(caughtError.errors).toContain(expectedError);
        }
    } else {
        expect(caughtError.errors).toEqual(expectedErrors);
    }
}

export function validateNoError(validator: Validator<unknown>, testValue: unknown,  expectedReturnValue?: unknown) {
    let caughtError: ValidationError;
    let returnValue: unknown;
    try {
        returnValue = validator("TestAttrib", testValue);
    } catch (e) {
        caughtError = e;
    }
    expect(caughtError).toBeUndefined();
    expect(returnValue).toEqual(expectedReturnValue != null ? expectedReturnValue : returnValue);
}