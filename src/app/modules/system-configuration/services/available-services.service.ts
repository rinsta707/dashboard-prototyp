import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {PageRequest} from "../../../shared/model/page-request";
import {Observable} from "rxjs";
import {Page} from "../../../shared/model/page";
import {environment} from "../../../../environments/environment";
import {Service} from "../../../shared/model/service";

const requestOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true,
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class AvailableServicesService {

  constructor(private http: HttpClient) {}

  public getAllPageable(pageRequest: PageRequest): Observable<HttpResponse<Page>> {
    return this.http.post<HttpResponse<Page>>(environment.basePath + environment.api.systemConfiguration.availableServices.getAllPageable, pageRequest,  requestOptions);
  }

  public getStandardPageable(pageRequest: PageRequest): Observable<HttpResponse<Page>> {
    return this.http.post<HttpResponse<Page>>(environment.basePath + environment.api.systemConfiguration.availableServices.getAllStandardPageable, pageRequest,  requestOptions);
  }

  public getServiceById(id: number): Observable<HttpResponse<Service>> {
    return this.http.get<HttpResponse<Service>>(environment.basePath + environment.api.systemConfiguration.availableServices.base + `/${id}`, requestOptions);
  }

  public addService(service: Service): Observable<HttpResponse<Service>> {
    return this.http.post<HttpResponse<Service>>(environment.basePath + environment.api.systemConfiguration.availableServices.base, service, requestOptions);
  }

  public addServices(services: number[]): Observable<HttpResponse<Service[]>> {
    return this.http.post<HttpResponse<Service[]>>(environment.basePath + environment.api.systemConfiguration.availableServices.base + '/add', services, requestOptions);
  }

  public deleteService(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(environment.basePath + environment.api.systemConfiguration.availableServices.base + `/${id}`, requestOptions);
  }

  public editService(service: Service): Observable<HttpResponse<Service>> {
    return this.http.put<HttpResponse<Service>>(environment.basePath + environment.api.systemConfiguration.availableServices.base + `/${service.id}`, service, requestOptions);
  }


}
