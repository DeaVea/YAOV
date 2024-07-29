import { objectValidator } from "../ObjectValidator";
import { ValidationError } from "../../ValidationError";
import { Validator } from "../../Validator";
import { validateError, validateNoError } from "./ValidateError";

describe(objectValidator.name, () => {
    const errorValidator: Validator<unknown> = jest.fn().mockImplementation((key) => {
        throw new ValidationError([`${String(key)}: err1`, `${String(key)}: err2`])
    });
    const noErrorValidator: Validator<unknown> = jest.fn().mockImplementation((key, value) => value);

    it("Throws an error of the objects.", () => {
        const objValidator = {
            key1: errorValidator,
            key2: errorValidator
        };
        const objToValidate = {
            key1: "value",
            key2: "value"
        };
        validateError(objectValidator(objValidator), objToValidate, ["TestAttrib.key1: err1", "TestAttrib.key1: err2", "TestAttrib.key2: err1", "TestAttrib.key2: err2"])
    });

    it("Does not throw the error for all objects.", () => {
        const objValidator = {
            key1: noErrorValidator,
            key2: noErrorValidator
        };
        const objToValidate = {
            key1: "value",
            key2: "value"
        };
        validateNoError(objectValidator(objValidator), objToValidate);
    });

    it("Throws an error for extra keys.", () => {
        const objValidator = {
            key1: noErrorValidator,
            key2: noErrorValidator
        };
        const objToValidate = {
            key1: "value",
            key2: "value",
            key3: "value",
            key4: "value"
        };
        validateError(objectValidator(objValidator), objToValidate, [`TestAttrib.key3: Unknown attribute`, `TestAttrib.key4: Unknown attribute`]);
    });

    it("Does not throw error if the keys are specific arrays.", () => {
        const objValidator = {
            key1: noErrorValidator,
            key2: noErrorValidator
        };
        const objToValidate = {
            ["key1[0]"]: "value",
            ["key2[0]"]: "value"
        };
        validateNoError(objectValidator(objValidator), objToValidate);
    });

    it("Validated only the keys available when requested.", () => {
        const objValidator = {
            key1: errorValidator,
            key2: errorValidator,
            key3: errorValidator,
            key4: errorValidator
        };
        const objToValidate = {
            key3: "value",
            key4: "value"
        };
        validateError(objectValidator(objValidator, { validateOnlyAvailableAttributes: true }), objToValidate, [
            "TestAttrib.key3: err1", "TestAttrib.key3: err2", "TestAttrib.key4: err1", "TestAttrib.key4: err2"
        ]);
    });

    it("Throws an error if the item is not an object.", () => {
        const objValidator = {
            key1: noErrorValidator,
            key2: noErrorValidator
        };
        validateError(objectValidator(objValidator), 5, [`TestAttrib: Value is not an object; Received - number`]);
    });

    it("Does not throw errors for undefined.", () => {
        const objValidator = {
            key1: noErrorValidator,
            key2: noErrorValidator
        };
        validateNoError(objectValidator(objValidator), undefined);
    });

    it("Throws an error for uncaught exception.", () => {
        const errorValidator: Validator<unknown> = jest.fn().mockImplementation(() => {
            throw new Error("Uncaught exception")
        });
        const objValidator = {
            key1: errorValidator,
            key2: errorValidator
        };
        const objToValidate = {
            key1: "value",
            key2: "value"
        };
        validateError(objectValidator(objValidator), objToValidate, [`TestAttrib.key1: Uncaught exception`, `TestAttrib.key2: Uncaught exception`]);
    });

    it("Transforms the object", () => {
        const testValidator: Validator<unknown> = jest.fn().mockReturnValue(5);
        const objValidator = {
            key1: testValidator,
            key2: testValidator
        };
        const objToValidate = {
            key1: "value",
            key2: "value"
        };
        validateNoError(objectValidator(objValidator), objToValidate, {
            key1: 5,
            key2: 5
        });
    });

    describe("clone", () => {
        it("Clones the validation thing.", () => {
            const objValidator = {
                key1: errorValidator,
                key2: errorValidator
            };
            const objToValidate = {
                key1: "value",
                key2: "value"
            };
            const originalValidator = objectValidator(objValidator);
            const clonedValidator = originalValidator.clone();
            const clonedValidatorWithNewOpts = originalValidator.clone({
                validateOnlyAvailableAttributes: true
            });
            validateError(clonedValidator, objToValidate, ["TestAttrib.key1: err1", "TestAttrib.key1: err2", "TestAttrib.key2: err1", "TestAttrib.key2: err2"]);
            validateError(clonedValidatorWithNewOpts, { key1: "value" }, ["TestAttrib.key1: err1", "TestAttrib.key1: err2"]);
        });
    })
});