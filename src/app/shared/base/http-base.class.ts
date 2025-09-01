import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpManagerClass } from './http-manager.class';
import { Injector } from '@angular/core';
import { defaultHTTPRequestOptionsConfig } from '../config/http-requests-header.config';
import { AuthenticationService } from '../services/authentication.service';
import { switchMap } from 'rxjs/operators';

export abstract class HttpBaseClass extends HttpManagerClass {
	protected authService: AuthenticationService;
	private readonly http: HttpClient;

	constructor(protected injector: Injector) {
		super(injector);
		this.authService = this.injector.get(AuthenticationService);
		this.http = this.injector.get(HttpClient);
	}

	get<T>(apiEndPoint: string, options = defaultHTTPRequestOptionsConfig, showLoader = true, host = this.settingsService.settings.baseUrl, isPublic = false): Observable<HttpResponse<T>> {
		if (!this.authService.checkIfUserIsAvailable() && !isPublic) {
			return this.authService.refreshToken().pipe(switchMap(response => this.http.get<HttpResponse<T>>(this.getRequestUrl(host, apiEndPoint), this.overwriteDefaultOptions(options, showLoader))));
		} else {
			return this.http.get<HttpResponse<T>>(this.getRequestUrl(host, apiEndPoint), this.overwriteDefaultOptions(options, showLoader));
		}
	}

	post<T>(apiEndPoint: string, body?: any, options = defaultHTTPRequestOptionsConfig, showLoader = true, host = this.settingsService.settings.baseUrl, isPublic = false): Observable<HttpResponse<T>> {
		if (!this.authService.checkIfUserIsAvailable() && !isPublic) {
			return this.authService.refreshToken().pipe(switchMap(response => this.http.post<HttpResponse<T>>(this.getRequestUrl(host, apiEndPoint), body, this.overwriteDefaultOptions(options, showLoader))));
		} else {
			return this.http.post<HttpResponse<T>>(this.getRequestUrl(host, apiEndPoint), body, this.overwriteDefaultOptions(options, showLoader));
		}
	}

	put<T>(apiEndPoint: string, body?: any, options = defaultHTTPRequestOptionsConfig, showLoader = true, host = this.settingsService.settings.baseUrl, isPublic = false): Observable<HttpResponse<T>> {
		if (!this.authService.checkIfUserIsAvailable() && !isPublic) {
			return this.authService.refreshToken().pipe(switchMap(response => this.http.put<HttpResponse<T>>(this.getRequestUrl(host, apiEndPoint), body, this.overwriteDefaultOptions(options, showLoader))));
		} else {
			return this.http.put<HttpResponse<T>>(this.getRequestUrl(host, apiEndPoint), body, this.overwriteDefaultOptions(options, showLoader));
		}
	}

	delete<T>(apiEndPoint: string, body?: any, options = defaultHTTPRequestOptionsConfig, showLoader = true, host = this.settingsService.settings.baseUrl, isPublic = false): Observable<HttpResponse<T>> {
		if (!this.authService.checkIfUserIsAvailable() && !isPublic) {
			return this.authService.refreshToken().pipe(switchMap(response => this.http.delete<HttpResponse<T>>(this.getRequestUrl(host, apiEndPoint), this.overwriteDefaultOptions(options, showLoader, body))));
		} else {
			return this.http.delete<HttpResponse<T>>(this.getRequestUrl(host, apiEndPoint), this.overwriteDefaultOptions(options, showLoader, body));
		}
	}
}
