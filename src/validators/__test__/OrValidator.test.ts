import { orValidator } from "../OrValidator";
import { ValidationError } from "../../ValidationError";
import { validateError } from "./ValidateError";

describe(orValidator.name, () => {
    it("Returns a mutated value of the original.", () => {
        const val1 = jest.fn().mockReturnValue(1);
        const val2 = jest.fn().mockReturnValue(2);
        const fullValidator = orValidator(val1, val2);
        const result = fullValidator("TestKey", 0);
        expect(result).toEqual(1);
        expect(val1).toBeCalledWith("TestKey", 0);
        expect(val2).not.toBeCalled();
    });

    it("Does not throw an error if the next validator passes.", () => {
        const val1 = jest.fn().mockImplementation((key) => {
            throw new ValidationError([`${key}: Error found`])
        });
        const val2 = jest.fn().mockReturnValue(2);

        const fullValidator = orValidator(val1, val2);
        const result = fullValidator("TestKey", 0);
        expect(result).toEqual(2);
        expect(val1).toBeCalledWith("TestKey", 0);
        expect(val2).toBeCalledWith("TestKey", 0);
    });

    it("Captures the errors thrown by the second validator.", () => {
        const val1 = jest.fn().mockImplementation((key) => {
            throw new ValidationError([`${key}: Error found`])
        });
        const val2 = jest.fn().mockImplementation((key) => {
            throw new ValidationError([`${key}: Another Error found`, `${key}: Another another error found`])
        });
        const fullValidator = orValidator(val1, val2);
        validateError(fullValidator, 5, [`"TestAttrib: Error found" OR "TestAttrib: Another Error found\nTestAttrib: Another another error found"`]);
    });
});