import { isDate } from "../IsDate";

describe(isDate.name, () => {
    it("Tests that a bad string value returns false.", () => {
        expect(isDate("hello")).toBe(false);
    });

    it("Tests that a Date object is valid.", () => {
        expect(isDate(new Date())).toBe(true);
    });

    it("Tests that a number is valid.", () => {
        expect(isDate(new Date().getTime())).toBe(true);
    });

    it("Tests that an ISO string is valid.", () => {
        expect(isDate(new Date().toISOString())).toBe(true);
    });

    it("Tests that an object is invalid.", () => {
        expect(isDate({} as unknown)).toBe(false);
    });
});