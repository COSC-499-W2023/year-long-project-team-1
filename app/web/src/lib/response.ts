/*
 * Created on Fri Oct 27 2023
 * Author: Connor Doman
 */

export interface JSONErrorLink {
    about?: URL;
    type?: URL;
}

export interface JSONErrorSource {
    pointer?: string;
    parameter?: string;
};


export interface JSONError {
    status?: number;
    id?: string;
    links?: JSONErrorLink;
    code?: string;
    title?: string;
    detail?: string;
    source?: JSONErrorSource;
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
            status: 501,
            title: "Not Implemented",
        },
    ],
};

export const RESPONSE_NOT_AUTHORIZED: JSONResponse = {
    errors: [
        {
            status: 401,
            title: "Unauthorized",
        },
    ],
};

export const RESPONSE_OK: JSONResponse = {
    data: {
        status: 200,
        title: "OK",
    },
};

export class JSONErrorBuilder {
    private _error: JSONError;

    constructor() {
        this._error = {};
    }

    reset() {
        this._error = {};
    }

    status(status: number): JSONErrorBuilder {
        this._error.status = status;
        return this;
    }

    id(id?: string) {
        this._error.id = id;
        return this;
    }

    links(links: JSONErrorLink) {
        this._error.links = links;
        return this;
    }

    code(code?: string) {
        this._error.code = code;
        return this;
    }

    title(title?: string) {
        this._error.title = title;
        return this;
    }

    detail(detail?: string) {
        this._error.detail = detail;
        return this;
    }

    source(source?: JSONErrorSource) {
        this._error.source = source;
        return this;
    }

    meta(meta?: string) {
        this._error.meta = meta;
        return this;
    }

    build(): JSONError {
        return this._error;
    }

    static instance() {
        return new JSONErrorBuilder();
    }

    static from(status: number, title: string, detail?: string): JSONError {
        return { status, title, detail };
    }
}


export class JSONResponseBuilder {
    private _response: JSONResponse;

    constructor() {
        this._response = {}
    }

    reset() {
        this._response = {}
    }

    data(data?: any) {
        this._response.data = data;
        return this;
    }

    error(error?: JSONError) {
        if (error) {
            let prevErrors = this._response.errors ?? [];
            this._response.errors = prevErrors.concat([error]);
        }
        return this;
    }

    errors(errors?: JSONError[]) {
        this._response.errors = errors;
        return this;
    }
    
    meta(meta?: any) {
        this._response.data = meta;
        return this;
    }

    build(): JSONResponse {
        return this._response;
    }

    static instance() {
        return new JSONResponseBuilder();
    }

    static from(status: number, error: JSONError): JSONResponse {
        return {
            errors: [error]
        };
    }
}
