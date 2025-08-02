import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {PageRequest} from "../../../shared/model/page-request";
import {Observable} from "rxjs";
import {Page} from "../../../shared/model/page";
import {environment} from "../../../../environments/environment";
import {ProvisioningOption} from "../../../shared/model/provisioning-option";

const requestOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true,
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class ProvisioningOptionsService {

  constructor(private http: HttpClient) {}

  public getAllPageable(pageRequest: PageRequest): Observable<HttpResponse<Page>> {
    return this.http.post<HttpResponse<Page>>(environment.basePath + environment.api.systemConfiguration.provisioning.getAllPageable, pageRequest,  requestOptions);
  }

  public getStandardPageable(pageRequest: PageRequest): Observable<HttpResponse<Page>> {
    return this.http.post<HttpResponse<Page>>(environment.basePath + environment.api.systemConfiguration.provisioning.getAllStandardPageable, pageRequest,  requestOptions);
  }

  public getProvisioningOptionById(id: number): Observable<HttpResponse<ProvisioningOption>> {
    return this.http.get<HttpResponse<ProvisioningOption>>(environment.basePath + environment.api.systemConfiguration.provisioning.base + `/${id}`, requestOptions);
  }

  public addProvisioningOption(option: ProvisioningOption): Observable<HttpResponse<ProvisioningOption>> {
    return this.http.post<HttpResponse<ProvisioningOption>>(environment.basePath + environment.api.systemConfiguration.provisioning.base, option, requestOptions);
  }

  public addProvisioningOptions(options: number[]): Observable<HttpResponse<ProvisioningOption[]>> {
    return this.http.post<HttpResponse<ProvisioningOption[]>>(environment.basePath + environment.api.systemConfiguration.provisioning.base + '/add', options, requestOptions);
  }

  public deleteProvisioningOption(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(environment.basePath + environment.api.systemConfiguration.provisioning.base + `/${id}`, requestOptions);
  }

  public editProvisioningOption(option: ProvisioningOption): Observable<HttpResponse<ProvisioningOption>> {
    return this.http.put<HttpResponse<ProvisioningOption>>(environment.basePath + environment.api.systemConfiguration.provisioning.base + `/${option.id}`, option, requestOptions);
  }

}
