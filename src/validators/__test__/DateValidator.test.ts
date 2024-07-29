import { dateValidator } from "../DateValidator";
import { validateError, validateNoError } from "./ValidateError";

describe(dateValidator.name, () => {
    it("Tests that no errors are thrown on valid date.", () => {
        const validator = dateValidator();
        const now = new Date().toISOString();
        validateNoError(validator, now);
    });

    it("Tests that the date is converted to an ISO string by default.", () => {
        const validator = dateValidator();
        const now = new Date();
        validateNoError(validator, now, now.toISOString());
    });

    it("Tests that the date is converted to what the converter decides.", () => {
        const validator = dateValidator(jest.fn().mockReturnValue(10));
        validateNoError(validator, new Date(), 10);
    });

    it("Throws an error for an invalid date.", () => {
        const validator = dateValidator();
        validateError(validator, "Hello", [`TestAttrib: Value "Hello" is not a valid date.`])
    });
});