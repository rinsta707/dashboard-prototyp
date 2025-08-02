import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {PageRequest} from "../../../shared/model/page-request";
import {Observable} from "rxjs";
import {Page} from "../../../shared/model/page";
import {environment} from "../../../../environments/environment";
import {User} from "../../../shared/model/user";
import {SystemLogsFilterParameters} from "../model/filter-parameters";

const requestOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true,
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class SystemLogsService {

  constructor(private http: HttpClient) { }

  public getAllPageable(pageRequest: PageRequest, filterParameters?: SystemLogsFilterParameters): Observable<HttpResponse<Page>> {
    let params = new HttpParams();
    if (filterParameters) {
      for (const [key, value] of Object.entries(filterParameters)) {
        if (value) {
          params = params.append(key, value.toString());
        }
      }
    }
    return this.http.post<HttpResponse<Page>>(environment.basePath + environment.api.systemLogs.getAllPageable, pageRequest, {... requestOptions, params });
  }

  public getUsersFromLogs(): Observable<User[]> {
    return this.http.get<User[]>(environment.basePath + environment.api.systemLogs.users);
  }

  public getOperationsFromLogs(): Observable<string[]> {
    return this.http.get<string[]>(environment.basePath + environment.api.systemLogs.operations);
  }

  public getDatesFromLogs(): Observable<{FROM:string, TO: string}> {
    return this.http.get<{FROM:string, TO: string}>(environment.basePath + environment.api.systemLogs.dates);
  }

}
