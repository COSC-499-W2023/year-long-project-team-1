/*
 * Created on Fri Oct 27 2023
 * Author: Connor Doman
 */

export interface JSONError {
    status: string;
    id?: string;
    links?: {
        about?: URL;
        type?: URL;
    };
    code?: string;
    title?: string;
    detail?: string;
    source?: {
        pointer?: string;
        parameter?: string;
    };
    meta?: any;
}

export interface JSONResponse {
    data?: any;
    errors?: JSONError[];
    meta?: any;
}

export const RESPONSE_NOT_IMPLEMENTED: JSONResponse = {
    errors: [
        {
            status: "501",
            title: "Not Implemented",
        },
    ],
};
