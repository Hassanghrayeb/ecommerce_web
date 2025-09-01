import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  public isSmallDevice$ = new BehaviorSubject<boolean>(false);
  public isMediumDevice$ = new BehaviorSubject<boolean>(false);

  private smallQuery: string = '(max-width: 990px)';
  private mediumQuery: string = '(max-width: 959px)';

  constructor(private breakpointObserver: BreakpointObserver) {
    // Observe small devices
    this.breakpointObserver.observe(this.smallQuery)
      .pipe(map(result => result.matches))
      .subscribe(isMatch => this.isSmallDevice$.next(isMatch));

    // Observe medium devices
    this.breakpointObserver.observe(this.mediumQuery)
      .pipe(map(result => result.matches))
      .subscribe(isMatch => this.isMediumDevice$.next(isMatch));
  }
}
