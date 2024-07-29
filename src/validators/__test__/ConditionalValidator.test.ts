import { conditionalValidator } from "../ConditionalValidator";
import { validateError, validateNoError } from "./ValidateError";
import { ValidationError } from "../../ValidationError";
import { Validator } from "../../Validator";

/* eslint no-constant-condition: 0 */
// The "no constant condition" is disabled because putting a constant "true" or "false" is a better
// illustration of what's happening.
describe(conditionalValidator.name, () => {
    const errorValidator: Validator<unknown> = jest.fn().mockImplementation(() => {
        throw new ValidationError([`Error per requirement of the test.`])
    });
    const noErrorValidator = jest.fn().mockImplementation((key, value) => value);

    it("Does not throw errors if the contion match a good validator", () => {
        const validator = conditionalValidator(
            () => true ? noErrorValidator : null,
            () => false ? errorValidator : null);
        validateNoError(validator, "TestError");
    });

    it("Throws errors caught in the array.", () => {
        const validator = conditionalValidator(
            () => false ? noErrorValidator : null,
            () => true ? errorValidator : null);
        validateError(validator, "TestError", [`Error per requirement of the test.`]);
    });

    it("Throws errors if no validator matches", () => {
        const validator = conditionalValidator(
            () => false ? noErrorValidator : null,
            () => false ? errorValidator : null);
        validateError(validator, "TestError", [`TestAttrib: Value of TestError is not an acceptable value.`]);
    });
});