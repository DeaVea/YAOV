import { urlValidator } from "../UrlValidator";
import { validateError, validateNoError } from "./ValidateError";

describe(urlValidator.name, () => {
    it("Doesn't throw an error for valid URL", () => {
        validateNoError(urlValidator(), "https://www.myUrl.com/path?param1=value");
    });

    it("Does not throw an error for undefined", () => {
        validateNoError(urlValidator(), undefined);
    });

    it("Does not throw an error for null", () => {
        validateNoError(urlValidator(), null);
    });

    it("Throws error for non URL string.", () => {
        validateError(urlValidator(), "NotAURL", ["TestAttrib: Value \"NotAURL\" is not a valid URL."]);
    });

    it("Throws error for non strings.", () => {
        validateError(urlValidator(), 5, ["TestAttrib: Value \"5\" is not a valid URL."]);
        validateError(urlValidator(), true, ["TestAttrib: Value \"true\" is not a valid URL."]);
        validateError(urlValidator(), { param: 5 }, ["TestAttrib: Value \"[object Object]\" is not a valid URL."]);
    });
});