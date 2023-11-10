/*
 * Created on Sun Oct 29 2023
 * Author: Connor Doman
 */

import Users from "@conf/user.properties.json";

export const DEBUG = false;

export const CONFIG_DIRECTORY = process.env.PRIVACYPAL_CONFIG_DIR ?? "/opt/privacypal/";

export const extractBasicUserRecords = () => {
    return Users;
};
