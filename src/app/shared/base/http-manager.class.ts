import { HttpRequestOptions } from '../models/http-request-options.model';
import { defaultHTTPRequestOptionsConfig } from '../config/http-requests-header.config';
import { Injector } from '@angular/core';
import { SettingsService } from '../services/settings.service';

export abstract class HttpManagerClass {
    protected settingsService: SettingsService;

    constructor(protected injector: Injector) {
        this.settingsService = this.injector.get(SettingsService);
    }

    protected getRequestUrl(host: string, apiEndpoint: string): string {
        const baseUrl = host ? host : this.settingsService.settings.baseUrl;
        return `${baseUrl}${apiEndpoint}`;
    }

    protected overwriteDefaultOptions(options: HttpRequestOptions, showLoader = true, body?: any): HttpRequestOptions {
        options = this.makeSureOptionsAreDefined(options);
        options = this.makeSureHeadersAreDefined(options);
        options = this.setShowLoaderHeader(options, showLoader);
        options = this.setRequestBody(options, body);
        options = this.setErrorRedirectHeader(options, options.redirectOnError);

        return Object.assign({}, defaultHTTPRequestOptionsConfig, options);
    }

    protected setAndGetParams(obj: any): any {
        return { params: obj };
    }

    private makeSureOptionsAreDefined(options: HttpRequestOptions): HttpRequestOptions {
        if (options && !options.observe) { options.observe = 'response'; }
        return options ? options : defaultHTTPRequestOptionsConfig;
    }

    private makeSureHeadersAreDefined(options: HttpRequestOptions): HttpRequestOptions {
        const headersDefined = options.headers ? options.headers : undefined;
        if (!headersDefined) {
            options.headers = defaultHTTPRequestOptionsConfig.headers;
        }
        return options;
    }

    private setShowLoaderHeader(options: HttpRequestOptions, showLoader = true): HttpRequestOptions {
        options.headers = options?.headers?.set('showLoader', `${showLoader}`);
        options.withCredentials = false;
        return options;
    }

    private setRequestBody(options: HttpRequestOptions, body?: any): HttpRequestOptions {
        options.body = body;
        return options;
    }

    private setErrorRedirectHeader(options: HttpRequestOptions, redirectOnError = false): HttpRequestOptions {
        options.headers = options?.headers?.set('redirectOnError', `${redirectOnError}`);
        return options;
    }
}
