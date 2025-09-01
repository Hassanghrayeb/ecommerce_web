import { HttpHeaders, HttpParams } from '@angular/common/http';

export class HttpRequestOptions {
    constructor(
        public headers?: HttpHeaders,
        public observe?: any,
        public params?: HttpParams | {
            [param: string]: any | any[],
        },
        public body?: any,
        public reportProgress?: boolean,
        public responseType?: any,
        public withCredentials?: boolean,
        public redirectOnError?: boolean
    ) {
    }
}

export interface ValidationModel {
    hasAccess: boolean;
}