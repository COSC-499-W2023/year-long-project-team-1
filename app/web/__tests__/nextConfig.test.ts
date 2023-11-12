/*
 * Created on Sun Nov 12 2023
 * Author: Connor Doman
 */

import nextConfig from "../next.config";

describe("Next Config", () => {
    it("should have a valid config", () => {
        expect(nextConfig).toBeDefined();
    });

    it("should be in standalone mode", () => {
        expect(nextConfig.output).toEqual("standalone");
    });
});
