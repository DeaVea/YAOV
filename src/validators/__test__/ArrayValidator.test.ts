import { arrayValidator } from "../ArrayValidator";
import { validateError, validateNoError } from "./ValidateError";
import { ValidationError } from "../../ValidationError";
import { Validator } from "../../Validator";

describe(arrayValidator.name, () => {
    const errorValidator: Validator<unknown> = jest.fn().mockImplementation((key) => {
        throw new ValidationError([`${String(key)}: err1`, `${String(key)}: err2`])
    });
    const noErrorValidator = jest.fn().mockImplementation((key, value) => value);

    it("Does not throw errors for valid array.", () => {
        const validator = arrayValidator(noErrorValidator);
        validateNoError(validator, ["one", "two"]);
    });

    it("Does not throw an error for undefined.", () => {
        const validator = arrayValidator(noErrorValidator);
        validateNoError(validator, undefined);
    });

    it("Throws errors caught in the array.", () => {
        const validator = arrayValidator(errorValidator);
        validateError(validator, ["one", "two"], [`TestAttrib.0: err1`, `TestAttrib.0: err2`, `TestAttrib.1: err1`, `TestAttrib.1: err2`])
    });

    it("Throws error if the error is longer than requested length", () => {
        const validator = arrayValidator(noErrorValidator, { maxLength: 2 });
        validateError(validator, ["one", "two", "three"], ["TestAttrib: Array is too long. Limit: 2; Received: 3"])
    });

    it("Transforms the array", () => {
        const itemValidator = jest.fn().mockReturnValue(5);
        const validator = arrayValidator(itemValidator);
        validateNoError(validator, ["one", "two"], [5, 5]);
    });

    it("Transforms errors that were uncaught.", () => {
        const errorValidator: Validator<unknown> = jest.fn().mockImplementation(() => {
            throw new Error("Uncaught exception.")
        });
        const validator = arrayValidator(errorValidator);
        validateError(validator, ["one", "two"], [`TestAttrib.0: Uncaught exception.`, `TestAttrib.1: Uncaught exception.`]);
    });

    it("Only validates the one item if requested at the index.", () => {
        const errorValidator: Validator<unknown> = jest.fn().mockImplementation(() => {
            throw new Error("Uncaught exception.")
        });
        const validator = arrayValidator(errorValidator);
        let caughtError: Error;
        try {
            validator("key[0]", "one");
        } catch (e) {
            caughtError = e;
        }
        expect(errorValidator).toHaveBeenCalledWith("key[0]", "one");
        expect(caughtError).toBeInstanceOf(ValidationError);
        expect(caughtError.message).toEqual("key[0]: Uncaught exception.");
    });

    it("Only validates the one item attribute if requested at the index.", () => {
        const errorValidator: Validator<unknown> = jest.fn().mockImplementation(() => {
            throw new Error("Uncaught exception.")
        });
        const validator = arrayValidator(errorValidator);
        let caughtError: Error;
        try {
            validator("key[0].singleAttrib", "one");
        } catch (e) {
            caughtError = e;
        }
        expect(errorValidator).toHaveBeenCalledWith("key[0].singleAttrib", "one");
        expect(caughtError).toBeInstanceOf(ValidationError);
        expect(caughtError.message).toEqual("key[0].singleAttrib: Uncaught exception.");
    });
});