import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimerService } from "../services/timer.service";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private autoLogoutService: TimerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.autoLogoutService.resetTimer();

    req = req.clone({
      withCredentials: true,
    });

    return next.handle(req);
  }
}
