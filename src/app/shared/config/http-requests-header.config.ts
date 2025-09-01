import { HttpHeaders } from '@angular/common/http';
import { HttpRequestOptions } from '../models/http-request-options.model';

export const defaultHTTPRequestOptionsConfig = new HttpRequestOptions(
    new HttpHeaders({ 'showLoader': 'true' }),
    'response'
);
