import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { PageRequest } from "../../../shared/model/page-request";
import { Observable } from "rxjs";
import { Page } from "../../../shared/model/page";
import { environment } from "../../../../environments/environment";
import { EventsFilterParameters } from '../components/model/filter-parameters';


const requestOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  public getAllPageable(pageRequest: PageRequest, filterParameters?: EventsFilterParameters): Observable<HttpResponse<Page>> {
    let params = new HttpParams();
    if (filterParameters) {
      for (const [key, value] of Object.entries(filterParameters)) {
        if (value) {
          params = params.append(key, value.toString());
        }
      }
    }
    return this.http.post<HttpResponse<Page>>(environment.basePath + environment.api.events.all, pageRequest, { ...requestOptions, params });
  }

  public getApiKeyFromEvents(): Observable<string[]> {
    return this.http.get<string[]>(environment.basePath + environment.api.events.apikey);
  }

  public getEventsFromEvents(): Observable<string[]> {
    return this.http.get<string[]>(environment.basePath + environment.api.events.event);
  }

  public getDatesFromEvents(): Observable<{ FROM: string, TO: string }> {
    return this.http.get<{ FROM: string, TO: string }>(environment.basePath + environment.api.events.dates);
  }

  public getServicesFromEvents(): Observable<string[]> {
    return this.http.get<string[]>(environment.basePath + environment.api.events.service);
  }

}
