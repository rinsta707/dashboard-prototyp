import {Injectable} from "@angular/core";
import {LoggedUserService} from "./logged-user.service";

const SYSTEM_ADMIN_ROLE = 'ROLE_SYSTEM_ADMIN';
const ADMIN_ROLE = 'ROLE_ADMIN';
const USER_ROLE = 'ROLE_USER';
const GUEST_ROLE = 'ROLE_VIEWER';

@Injectable({
  providedIn: 'root'
})
export class UserRoleCheck {

  constructor(private storageService: LoggedUserService) {
  }

  public isSystemAdmin(): boolean {
    return this.storageService.hasRole([SYSTEM_ADMIN_ROLE]);
  }

  public isAdmin(): boolean {
    return this.storageService.hasRole([ADMIN_ROLE]);
  }

  public isUser(): boolean {
    return this.storageService.hasRole([USER_ROLE]);
  }

  public isGuest(): boolean {
    return this.storageService.hasRole([GUEST_ROLE]);
  }
}
