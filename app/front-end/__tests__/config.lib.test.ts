/*
 * Created on Sun Oct 29 2023
 * Author: Connor Doman
 */

import { extractConfigFile } from "@lib/config";

describe("Config Library Tests", () => {
    it("extractConfigFile works for valid config file", async () => {
        const config = await extractConfigFile("extractConfigFile.test.json", "./__tests__/test-configs");
        expect(config).toEqual({
            tests: [
                {
                    id: 1,
                    name: "Test Extract Config File",
                },
            ],
        });
    });

    it("extractConfigFile works for invalid config file", async () => {
        const config = await extractConfigFile("invalidConfigFile.test.json", "./__tests__/test-configs");
        expect(config).toEqual({});
    });

    it("extractConfigFile works for non-existent config file", async () => {
        const config = await extractConfigFile("nonExistentConfigFile.test.json", "./__tests__/test-configs");
        expect(config).toEqual({});
    });

    it("extractConfigFile works for non-existent config directory", async () => {
        const config = await extractConfigFile("nonExistentConfigFile.test.json", "./__tests__/non-existent-dir");
        expect(config).toEqual({});
    });
});
