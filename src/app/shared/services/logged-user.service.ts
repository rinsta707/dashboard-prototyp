import {EventEmitter, Injectable} from '@angular/core';
import { User } from "../model/user";
import { USER_KEY } from "../model/shared-const";
import {MessageService} from "./message.service";

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {

  loginStatusChanged = new EventEmitter<void>();

  constructor(private messageService: MessageService) { }

  public clear(): void {
    window.sessionStorage.clear();
    this.loginStatusChanged.emit();
    this.messageService.ngOnDestroy();
  }

  public saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.loginStatusChanged.emit();
  }

  public getUser(): User | undefined {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return undefined;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    return !!user;
  }

  public hasRole(requiredRole: string[]) {
    if (requiredRole === undefined) {
      return true;
    }
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const userRoles = JSON.parse(user).roles;
      return requiredRole.some(role => userRoles.includes(role));
    }
    return false;
  }

  public getLocale(): string {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user).locale;
    }
    return 'de';
  }

  public getPaginatorDefault(): number {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user).paginatorDefault;
    }
    return 10;
  }

  public updateUserSettings(user: User): void {
    const currentUser = this.getUser();
    if (currentUser) {
      currentUser.paginatorDefault = user.paginatorDefault;
      currentUser.locale = user.locale;

      window.sessionStorage.removeItem(USER_KEY);
      window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

}
