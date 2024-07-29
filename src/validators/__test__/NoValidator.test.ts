import { noValidator } from "../NoValidator";
import { validateNoError } from "./ValidateError";

describe(noValidator.name, () => {
    it("Doesn't throw an error", () => {
        validateNoError(noValidator(), 5);
    });
});