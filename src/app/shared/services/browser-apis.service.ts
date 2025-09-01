import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserApisService {

  private isIntersectionObserverSupported: boolean = false;

  constructor() {
    this.isIntersectionObserverSupported = this.checkApiSupport('IntersectionObserver');
  }

  public checkApiSupport(api: string): boolean {
    return api in window;
  }

  public getIntersectionObserverSupport(): boolean {
    return this.isIntersectionObserverSupported;
  }
}
