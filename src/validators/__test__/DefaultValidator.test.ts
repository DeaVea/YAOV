import { defaultValidator } from "../DefaultValidator";

describe(defaultValidator.name, () => {
    it("Returns the default value on null value.", () => {
        const validator = defaultValidator("defaultValue");
        expect(validator("TestKey", null)).toEqual("defaultValue");
    });

    it("Returns the default value on undefined value.", () => {
        const validator = defaultValidator("defaultValue");
        expect(validator("TestKey", undefined)).toEqual("defaultValue");
    });

    it("Returns the default value on null value if the default value is a function.", () => {
        const validator = defaultValidator(() => "defaultValue");
        expect(validator("TestKey", null)).toEqual("defaultValue");
    });

    it("Returns the default value on undefined value if the deafult value is a function.", () => {
        const validator = defaultValidator(() => "defaultValue");
        expect(validator("TestKey", undefined)).toEqual("defaultValue");
    });

    it("Returns the falsy value.", () => {
        const validator = defaultValidator<string | number | boolean>("defaultValue");
        expect(validator("TestKey", false)).toEqual(false);
        expect(validator("TestKey", 0)).toEqual(0);
        expect(validator("TestKey", "")).toEqual("");
    });

    it("Returns the original value.", () => {
        const validator = defaultValidator("defaultValue");
        expect(validator("TestKey", "original")).toEqual("original");
    });
});