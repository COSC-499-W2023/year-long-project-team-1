/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

import { add } from "../src/app/api/example/route";
import "@testing-library/jest-dom";

describe("Example API", () => {
    it("add works for positive numbers", async () => {
        const sum = add(1, 2);
        expect(sum).toBe(3);
    });

    it("add works for negative numbers", async () => {
        const sum = add(-1, -2);
        expect(sum).toBe(-3);
    });

    it("add works for mixed numbers", async () => {
        const sum = add(-1, 2);
        expect(sum).toBe(1);
    });

    it("add works for zero", async () => {
        const sum = add(0, 0);
        expect(sum).toBe(0);
    });

    it("add works for large numbers", async () => {
        const sum = add(10000000000, 10000000000);
        expect(sum).toBe(20000000000);
    });
});
