import { rangeValidator } from "../RangeValidator";
import { validateError, validateNoError } from "./ValidateError";

describe(rangeValidator.name, () => {
    it("Tests that a number within range is returned.", () => {
        const validator = rangeValidator({ lowestAllowedValue: 5, highestAllowedValue: 6 });
        validateNoError(validator, 5.5);
    })

    it("Tests the error messages.", () => {
        validateError(rangeValidator({ lowestAllowedValue: 5 }), 4, ["TestAttrib: Value must be greater than or equal to 5."]);
        validateError(rangeValidator({ highestAllowedValue: 5 }), 7, ["TestAttrib: Value must be less than or equal to 5."]);
        validateError(rangeValidator({ lowestAllowedValue: 5, highestAllowedValue: 6 }), 4, ["TestAttrib: Value must be greater than or equal to 5 and value must be less than or equal to 6."]);
    });

    it("Tests that non numbers are handled properly.", () => {
        const validator = rangeValidator({ lowestAllowedValue: 5, highestAllowedValue: 5});
        validateNoError(validator, true);
        validateNoError(validator, "true");
        validateNoError(validator, undefined);
        validateNoError(validator, null);
        validateNoError(validator, Number.parseInt("NaN"));
    });
});