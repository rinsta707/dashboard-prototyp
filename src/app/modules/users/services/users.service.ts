import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../../../shared/model/user";
import { environment } from "../../../../environments/environment";
import { Page } from "../../../shared/model/page";
import { PageRequest } from "../../../shared/model/page-request";

const requestOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  
  public updateStatus(user: User): Observable<HttpResponse<User>> {
    return this.http.post<HttpResponse<User>>(environment.basePath + environment.api.users.updateStatus, user, requestOptions);
  }

  public getAllPageable(pageRequest: PageRequest): Observable<HttpResponse<Page>> {
    return this.http.post<HttpResponse<Page>>(environment.basePath + environment.api.users.getAllPageable, pageRequest, requestOptions);
  }

  public addUser(user: User): Observable<HttpResponse<User>> {
    return this.http.post<HttpResponse<User>>(environment.basePath + environment.api.users.base, user, requestOptions);
  }

  public deleteUser(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(environment.basePath + environment.api.users.base + `/${id}`, requestOptions);
  }

  public editUser(user: User): Observable<HttpResponse<User>> {
    return this.http.put<HttpResponse<User>>(environment.basePath + environment.api.users.base + `/${user.id}`, user, requestOptions);
  }

}
