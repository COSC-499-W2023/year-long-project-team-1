/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

export const redirUrlFromReq = (req: Request, url: string) => {
    const baseUrl = new URL(req.url).origin;
    return new URL(url, baseUrl).toString();
};
