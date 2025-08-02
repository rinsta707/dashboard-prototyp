//GH Copilot generated - start)

import {Injectable, Injector} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {LoggedUserService} from "../services/logged-user.service";
import {Router} from "@angular/router";
import {MessageService} from "../services/message.service";

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(private injector: Injector){ }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        next: event => {},
        error: err => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.injector.get(LoggedUserService).clear();
            this.injector.get(Router).navigate(['/login']);
          } else if (err instanceof HttpErrorResponse && err.status === 0) {
            this.injector.get(MessageService).showError('hcl-login-data.error.connection');
          } else if (err instanceof HttpErrorResponse && err.status === 500) {
            this.injector.get(MessageService).showError('hcl-login-data.error.server');
          }
        }
      })
    );
  }

}

//GH Copilot generated - end)
