import { Injectable } from '@angular/core';
import {StorageEnum} from "../models/storage.enum";

export enum ThemeEnum {
  DARK = 'dark-mode',
  LIGHT = 'light-mode',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private currentTheme = localStorage.getItem(StorageEnum.THEME) || ThemeEnum.DARK;

  public getCurrentTheme(): string {
    return this.currentTheme;
  }

  public isDarkTheme(): boolean {
    return this.currentTheme === ThemeEnum.DARK;
  }

  public setTheme(currentTheme: ThemeEnum): void{
    this.currentTheme = currentTheme;
    document.body.classList.remove(ThemeEnum.LIGHT, ThemeEnum.DARK);
    document.body.classList.add(`${currentTheme}`);
  }
}
