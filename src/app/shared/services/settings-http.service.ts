import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SettingsHttpService {

    constructor(private settingsService: SettingsService,
                private readonly httpClient: HttpClient) {
    }

    public initializeApp(): Promise<any> {
        return this.httpClient.get('assets/configs/settings.json').pipe(tap((settings: any) => {
            this.settingsService.settings = settings;
        })).toPromise();
    }
}
