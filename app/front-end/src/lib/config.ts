/*
 * Created on Sun Oct 29 2023
 * Author: Connor Doman
 */

// import fs from "fs/promises";
// import path from "path";

export const CONFIG_DIRECTORY = process.env.PRIVACYPAL_CONFIG_DIR ?? "/opt/privacypal/";
import Users from "@conf/user.properties.json";

export const extractUserConfig = () => {
    return Users;
};
