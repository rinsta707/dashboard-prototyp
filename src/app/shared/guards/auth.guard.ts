import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import { LoggedUserService } from "../services/logged-user.service";
import {Observable} from "rxjs";
import {HclRoute} from "@hacon/hcl";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  public readonly canSeeDiscriminator: 'HclCanSee' = 'HclCanSee';

  constructor(private router: Router, private storageService: LoggedUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const requiredRole = route.data['requiredRole'];
    if (this.storageService.isLoggedIn() && this.storageService.hasRole(requiredRole)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  public isHidden(navigationItem: HclRoute): boolean | Observable<boolean> {
    if (navigationItem.data && navigationItem.data['requiredRole']) {
      return !this.storageService.hasRole(navigationItem.data['requiredRole']);
    } else {
      return false;
    }
  }

}

