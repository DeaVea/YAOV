import { throwErrorIfErrors, ValidationError } from "../../ValidationError";

describe(ValidationError.name, () => {
    it("Tests the constructor and accessor", () => {
        const validationError = new ValidationError(["Err1", "Err2"]);
        expect(validationError.errors).toEqual(["Err1", "Err2"]);
        expect(validationError.message).toEqual("Err1\nErr2");
    });
});

describe(throwErrorIfErrors.name, () => {
    it("Does not throw errors if there is undefined.", () => {
        let caughtError: Error;
        try {
            throwErrorIfErrors(undefined);
        } catch(e) {
            caughtError = e;
        }
        expect(caughtError).toBeUndefined;
    });

    it("Does not throw errors if the errors are empty.", () => {
        let caughtError: Error;
        try {
            throwErrorIfErrors(undefined);
        } catch(e) {
            caughtError = e;
        }
        expect(caughtError).toBeUndefined;
    });

    it("Throws error if the errors exist.", () => {
        let caughtError: Error;
        try {
            throwErrorIfErrors(["Error1"]);
        } catch(e) {
            caughtError = e;
        }
        expect(caughtError).toBeInstanceOf(ValidationError);
    });
})