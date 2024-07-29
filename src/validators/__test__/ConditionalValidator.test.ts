import { conditionalValidator } from "../ConditionalValidator";
import { validateError, validateNoError } from "./ValidateError";
import { ValidationError } from "../../ValidationError";
import { Validator } from "../../Validator";

describe(conditionalValidator.name, () => {
    const errorValidator: Validator<unknown> = jest.fn().mockImplementation((key) => {
        throw new ValidationError([`Error per requirement of the test.`])
    });
    const noErrorValidator = jest.fn().mockImplementation((key, value) => value);

    it("Does not throw errors if the contion match a good validator", () => {
        const validator = conditionalValidator(
            (key, value) => true ? noErrorValidator : null,
            (key, value) => false ? errorValidator : null);
        validateNoError(validator, "TestError");
    });

    it("Throws errors caught in the array.", () => {
        const validator = conditionalValidator(
            (key, value) => false ? noErrorValidator : null,
            (key, value) => true ? errorValidator : null);
        validateError(validator, "TestError", [`Error per requirement of the test.`]);
    });

    it("Throws errors if no validator matches", () => {
        const validator = conditionalValidator(
            (key, value) => false ? noErrorValidator : null,
            (key, value) => false ? errorValidator : null);
        validateError(validator, "TestError", [`TestAttrib: Value of TestError is not an acceptable value.`]);
    });
});