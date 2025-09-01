import { Injectable } from '@angular/core';
import { Settings } from '../interfaces/settings.class';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    public settings: Settings;

    constructor() {}
}
