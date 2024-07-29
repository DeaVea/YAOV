import { uniquify } from "../Uniquify";

describe(uniquify.name, () => {

    it("Uniques a string array.", () => {
        const arr = uniquify(["1", "1", "2", "2", "1", "1", "2", "2", "3", "3", "4", "5", "4"]);
        expect(arr).toEqual(["1", "2", "3", "4", "5"]);
    });

    it("Uniques a number array", () => {
        const arr = uniquify([1, 1, 2, 2, 3, 3, 1, 1, 2, 2, 1, 1, 3, 4, 5, 4, 3]);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });
});