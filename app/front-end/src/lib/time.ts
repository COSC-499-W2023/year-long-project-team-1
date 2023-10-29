/*
 * Created on Thu Oct 26 2023
 * Author: Connor Doman
 */

/**
 * Returns the current time in UTC as a string in the form "<YYYYMMDD>T<HHmmss>"
 */
export const timeStampUTC = (fromDate?: Date): string => {
    const date = fromDate ? fromDate : new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const yearString = year.toString();
    const monthString = month.toString().padStart(2, "0");
    const dayString = day.toString().padStart(2, "0");
    const hoursString = hours.toString().padStart(2, "0");
    const minutesString = minutes.toString().padStart(2, "0");
    const secondsString = seconds.toString().padStart(2, "0");

    return `${yearString}${monthString}${dayString}T${hoursString}${minutesString}${secondsString}`;
};
