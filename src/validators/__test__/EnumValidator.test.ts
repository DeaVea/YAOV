import { enumValidator } from "../EnumValidator";
import { validateError, validateNoError } from "./ValidateError";

describe(enumValidator.name, () => {

    it("Throws an error for an invalid value.", () => {
        const validator = enumValidator("one", "two");
        validateError(validator, "three", [`TestAttrib: Invalid value - Expected: "one", or "two"; Received: "three"`]);
    });

    it("Handles situation with only one value.", () => {
        const validator = enumValidator("one");
        validateError(validator, "three", [`TestAttrib: Invalid value - Expected: "one"; Received: "three"`])
    });

    it("Does not throw an error with valid value.", () => {
        const validator = enumValidator("one", "two");
        validateNoError(validator, "two");
    });

    it("Does not throw an error with undefined.", () => {
        const validator = enumValidator("one", "two");
        validateNoError(validator, undefined);
    });
});