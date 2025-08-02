import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/model/user';


const requestOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true,
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class MyAccountService {

  constructor(private http: HttpClient) {}

  public updateSettings(user:User): Observable<HttpResponse<User>> {
    return this.http.put<HttpResponse<User>>(environment.basePath + environment.api.myaccount.base, user, requestOptions);
  }

  public getSettings(id:number): Observable<HttpResponse<User>> {
    return this.http.get<HttpResponse<User>>(environment.basePath + environment.api.myaccount.base+ `/${id}`, requestOptions);
  }
}
