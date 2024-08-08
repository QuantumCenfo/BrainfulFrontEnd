import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  isHandsetOrTablet$: Observable<boolean> = this.breakpointObserver.observe([
    Breakpoints.Handset,
    Breakpoints.Tablet
  ]).pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
