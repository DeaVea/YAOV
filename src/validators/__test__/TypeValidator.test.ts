import { numberValidator, stringValidator, typeValidator } from "../TypeValidator";
import { validateError, validateNoError } from "./ValidateError";

describe(typeValidator.name, () => {
    it("Valid results return the correct attribute.", () => {
        const validator = typeValidator("string");
        validateNoError(validator, "testValue");
    });

    it("Throws a ValidationError for invalid value.", () => {
        const validator = typeValidator("string");
        validateError(validator, 5, ["TestAttrib: Invalid type - Expected: \"string\"; Actual: \"number\""]);
    });

    it("Does not throw error for undefined.", () => {
        const validator = typeValidator("string");
        validateNoError(validator, undefined);
    });
});

describe(numberValidator.name, () => {
    it("Validates undefined.", () => {
        const validator = numberValidator();
        validateNoError(validator, undefined);
    });

    it("Validates the item is a number.", () => {
        const validator = numberValidator();
        validateError(validator, "5", ["TestAttrib: Invalid type - Expected: \"number\"; Actual: \"string\""]);
    });

    it("Validates the min.", () => {
        const validator = numberValidator({ min: 3 });
        validateNoError(validator, 3);
        validateNoError(validator, 4);
        validateError(validator, 2, ["TestAttrib: Value \"2\" is less than the min - Expected: >= 3; Actual: 2"]);
    });

    it("Validates the max.", () => {
        const validator = numberValidator({ max: 3 });
        validateNoError(validator, 3);
        validateNoError(validator, 2);
        validateError(validator, 4, ["TestAttrib: Value \"4\" is greater than the max - Expected: <= 3; Actual: 4"]);
    });

    it("Validates the isInt.", () => {
        const validator = numberValidator({ isInt: true });
        validateNoError(validator, 3);
        validateError(validator, 3.1, ["TestAttrib: Value \"3.1\" is not an integer."])
    })
});

describe(stringValidator.name, () => {
    it("Validates the item is a string.", () => {
        const validator = stringValidator();
        validateError(validator, 5, ["TestAttrib: Invalid type - Expected: \"string\"; Actual: \"number\""]);
    });

    it("Validates the item is outside the max range.", () => {
        const validator = stringValidator({ maxLength: 5 });
        validateError(validator, "123456", [`TestAttrib: Value "123456" outside max range - Expected: 5; Actual: 6`]);
    });

    it("Validates various maxLength options.", () => {
        let validator = stringValidator({
            maxLength: {
                maxLength: 5
            }
        });
        validateError(validator, "123456", [`TestAttrib: Value "123456" outside max range - Expected: 5; Actual: 6`]);

        validator = stringValidator({
            maxLength: {
                maxLength: 5,
                trim: true
            }
        })
        validateNoError(validator, "12345", "12345");

        validator = stringValidator({
            maxLength: {
                maxLength: 5,
                trim: {

                }
            }
        })
        validateNoError(validator, "12345", "12345");

        validator = stringValidator({
            maxLength: {
                maxLength: 5,
                trim: {
                    postFix: "..."
                }
            }
        })
        validateNoError(validator, "123456", "12...");

        validator = stringValidator({
            maxLength: {
                maxLength: 5,
                trim: {
                    postFix: "......"
                }
            }
        })
        validateError(validator, "123456", [`TestAttrib: Value "......" outside max range - Expected: 5; Actual: 6`]);
    });

    it("Validates the item is outside the min range.", () => {
        const validator = stringValidator({ minLength: 5 });
        validateError(validator, "1234", [`TestAttrib: Value "1234" outside min range - Expected: 5; Actual: 4`]);
    });

    it("Passes if within the min and max ranges.", () => {
        const validator = stringValidator({ minLength: 5, maxLength: 10 });
        validateNoError(validator, "12345");
        validateNoError(validator, "123456");
        validateNoError(validator, "1234567");
        validateNoError(validator, "12345678");
        validateNoError(validator, "1234567890");
    });

    it("Transforms the string to lowercase when requested.", () => {
        const validator = stringValidator({ transformLowercase: true });
        validateNoError(validator, "UPPER", "upper");
    });

    it("Transofrms the string to upper case if requested.", () => {
        const validator = stringValidator({ transformUppercase: true });
        validateNoError(validator, "lower", "LOWER");
    });
});