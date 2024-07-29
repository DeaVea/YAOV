import { andValidator } from "../AndValidator";
import { ValidationError } from "../../ValidationError";
import { validateError } from "./ValidateError";

describe(andValidator.name, () => {
    it("Returns a mutated value of the original.", () => {
        const val1 = jest.fn().mockReturnValue(1);
        const val2 = jest.fn().mockReturnValue(2);
        const fullValidator = andValidator(val1, val2);
        const result = fullValidator("TestKey", 0);
        expect(result).toEqual(2);
        expect(val1).toBeCalledWith("TestKey", 0);
        expect(val2).toBeCalledWith("TestKey", 1);
    });

    it("Captures the errors thrown by the validators.", () => {
        const val1 = jest.fn().mockImplementation((key) => {
            throw new ValidationError([`${key}: Error found`])
        });
        const val2 = jest.fn().mockImplementation((key) => {
            throw new ValidationError([`${key}: Another Error found`])
        });
        const fullValidator = andValidator(val1, val2);
        validateError(fullValidator, 5, [`TestAttrib: Error found`]);
    });

    it("Properly clones wiht the new validators.", () => {
        const val1 = jest.fn().mockReturnValue(1);
        const val2 = jest.fn().mockReturnValue(2);
        const val3 = jest.fn().mockReturnValue(3);
        const val4 = jest.fn().mockReturnValue(4);
        const originalValidator = andValidator(val1, val2);
        const clonedValidator = originalValidator.clone([val3, val4]);
        const result = clonedValidator("TestKey", 0);
        expect(result).toEqual(4);
        expect(val1).toBeCalledWith("TestKey", 0);
        expect(val2).toBeCalledWith("TestKey", 1);
        expect(val3).toBeCalledWith("TestKey", 2);
        expect(val4).toBeCalledWith("TestKey", 3);
    });
});