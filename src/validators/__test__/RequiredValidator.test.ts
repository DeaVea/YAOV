import { requiredValidator } from "../RequiredValidator";
import { validateError, validateNoError } from "./ValidateError";

describe(requiredValidator.name, () => {
    it("Doesn't throw an error on object", () => {
        validateNoError(requiredValidator(), 5);
    });

    it("Throws an error if undefined.", () => {
        validateError(requiredValidator(), undefined, [`TestAttrib: Value was not defined but is required.`]);
    });

    it("Throws an error if null.", () => {
        validateError(requiredValidator(), undefined, [`TestAttrib: Value was not defined but is required.`]);
    });

    it("Does not throw errors on falsy.", () => {
        validateNoError(requiredValidator(), false);
        validateNoError(requiredValidator(), "");
        validateNoError(requiredValidator(), 0);
    });
});