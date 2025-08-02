import {Injectable} from '@angular/core';
import { Observable} from "rxjs";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { User } from "../model/user";
import { HclLoginData } from "@hacon/hcl";

const loginRequestOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true,
  observe: 'response' as 'body'
};

const logoutRequestOptions = {
  observe: 'response' as 'response'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  public login(loginRequest: HclLoginData): Observable<HttpResponse<User>> {
    return this.http.post<HttpResponse<User>>(environment.basePath + environment.api.auth.signin, loginRequest, loginRequestOptions);
  }

  public logout(): Observable<HttpResponse<any>> {
    return this.http.post(environment.basePath + environment.api.auth.signout, {}, logoutRequestOptions);
  }
}
