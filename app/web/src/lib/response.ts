/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export enum VideoStatus {
  DONE = "done",
  PROCESSING = "processing",
}

export interface JSONErrorLink {
  about?: URL;
  type?: URL;
}

export interface JSONErrorSource {
  pointer?: string;
  parameter?: string;
}

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

export const RESPONSE_NOT_FOUND: JSONResponse = {
  errors: [
    {
      status: 404,
      title: "Not Found",
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
    this._response = {};
  }

  reset() {
    this._response = {};
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
      errors: [error],
    };
  }
}
