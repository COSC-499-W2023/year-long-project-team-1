/*
 * Created on Sun Oct 29 2023
 * Author: Connor Doman
 */

import fs from "fs/promises";
import path from "path";

const CONFIG_DIRECTORY = process.env.PRIVACYPAL_CONFIG_DIR ?? "/opt/privacypal/";

export const extractConfigFile = async (configFileName: string, configDir: string = CONFIG_DIRECTORY) => {
    const filePath = path.join(configDir, configFileName);

    try {
        const file = await fs.readFile(filePath, "utf-8");
        const config = JSON.parse(file);

        return config;
    } catch (err: any) {
        console.error("Error reading config file: ", err.message);
        return {};
    }
};
