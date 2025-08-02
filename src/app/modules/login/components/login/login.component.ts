import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../../environments/environment";
import { AuthService } from "../../../../shared/services/auth.service";
import { Router } from "@angular/router";
import {catchError, finalize, Observable, of, Subscription, tap} from "rxjs";
import {
  HclEventBusService,
  HclEventRegister,
  HclLoginData,
  HclLoginEvent,
} from "@hacon/hcl";
import { MessageService } from "../../../../shared/services/message.service";
import { LoggedUserService } from "../../../../shared/services/logged-user.service";
import { User } from "../../../../shared/model/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',]
})
export class LoginComponent implements OnInit, OnDestroy {

  private readonly loginEventSubscription: Subscription;
  private loginDisabled: boolean = false;
  public loginError: boolean = false;

  public applicationName = environment.appTitle;

  public form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService,
              private router: Router,
              private eventBus: HclEventBusService,
              private messageService: MessageService,
              private storageService: LoggedUserService) {

    this.loginEventSubscription = this.eventBus.event$(HclEventRegister.HCL_LOGIN)
      .subscribe((event: HclLoginEvent) => {
        if (this.loginDisabled) {
          return;
        }
        this.submit(event.value);
      });

    this.handleError = this.handleError.bind(this);
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.router.navigateByUrl('dashboard');
    }
  }

  private submit(form: HclLoginData | undefined) {
    if (form != undefined && this.isValid(form)) {
      this.loginError = false;
      this.loginDisabled = true;
      this.authService.login(form).pipe(
        tap(response => {
          if (response.ok) {
            this.storageService.saveUser(response.body as User);
              this.router.navigate(['dashboard']);
          }
        }
      ), catchError(this.handleError),
         finalize(() => this.loginDisabled = false))
        .subscribe();
    }
  }

  private handleError(error: any): Observable<any> {
    if (error.status === 401) {
      this.loginError = true;
    } else if (error.status === 403) {
      this.messageService.showError('hcl-login-data.error.blocked');
    } else if (error.status === 0) {
      this.messageService.showError('hcl-login-data.error.connection');
    } else {
      this.messageService.showError('hcl-login-data.error.server');
    }
    return of({ error: true, message: error });
  }

  private isValid(form: HclLoginData): boolean {
    return form.username.length > 0 && form.password.length > 0;
  }

  ngOnDestroy(): void {
    if (this.loginEventSubscription) {
      this.loginEventSubscription.unsubscribe();
    }
  }

}
