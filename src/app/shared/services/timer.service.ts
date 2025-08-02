//GH Copilot generated - start)

import {Injectable, Injector, NgZone, OnDestroy} from '@angular/core';
import { Subscription, timer } from 'rxjs';
import {LoggedUserService} from "./logged-user.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TimerService implements OnDestroy {

  private subscription?: Subscription;
  private readonly inactivityTime = 60000 * 10;

  constructor(private injector: Injector, private ngZone: NgZone) {
    this.resetTimer();
  }

  resetTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.subscription?.unsubscribe();
      this.subscription = timer(this.inactivityTime).subscribe(() => {
        this.ngZone.run(() => this.logout());
      });
    });
  }

  logout() {
    this.injector.get(LoggedUserService).clear();
    this.injector.get(Router).navigate(['/login']);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

//GH Copilot generated - end)
