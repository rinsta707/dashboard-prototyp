import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessagesTemplate } from 'src/app/shared/model/messages-template';
import { Language } from 'src/app/shared/model/language';

const requestOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor(private http: HttpClient) {}

  public addMessagesTemplate(locale: MessagesTemplate): Observable<HttpResponse<MessagesTemplate>> {
    return this.http.post<HttpResponse<MessagesTemplate>>(environment.basePath + environment.api.systemConfiguration.messages.quota, locale, requestOptions);
  }

  public getSoftQuotaTemplate(): Observable<MessagesTemplate[]> {
    return this.http.get<MessagesTemplate[]>(environment.basePath + environment.api.systemConfiguration.messages.softQuota);
  }

  public getHardQuotaTemplate(): Observable<MessagesTemplate[]> {
    return this.http.get<MessagesTemplate[]>(environment.basePath + environment.api.systemConfiguration.messages.hardQuota);
  }

  public updateMessageTemplate(template: MessagesTemplate): Observable<HttpResponse<MessagesTemplate>> {
    return this.http.put<HttpResponse<MessagesTemplate>>(environment.basePath + environment.api.systemConfiguration.messages.quota + `/${template.id}`, template, requestOptions);
  }

  public deleteMessagesTemplate(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(environment.basePath + environment.api.systemConfiguration.messages.quota + `/${id}`, requestOptions);
  }

  public getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(environment.basePath + environment.api.systemConfiguration.messages.languages);
  }
}
