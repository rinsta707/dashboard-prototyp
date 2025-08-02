import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessagesReceiver } from 'src/app/shared/model/MessagesReceiver';

const requestOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class ReceiverService {
  constructor(private http: HttpClient) {}

  public getMessagesReceivers(): Observable<MessagesReceiver[]> {
    return this.http.get<MessagesReceiver[]>(environment.basePath + environment.api.systemConfiguration.messages.email);
  }

  public addMessagesReceiver(email: MessagesReceiver): Observable<HttpResponse<MessagesReceiver>> {
    return this.http.post<HttpResponse<MessagesReceiver>>(environment.basePath + environment.api.systemConfiguration.messages.email, email, requestOptions);
  }

  public deleteMessagesReceiver(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(environment.basePath + environment.api.systemConfiguration.messages.base + `/${id}`, requestOptions);
  }

  public updateMessageReceiver(email: MessagesReceiver): Observable<HttpResponse<MessagesReceiver>> {
    return this.http.put<HttpResponse<MessagesReceiver>>(environment.basePath + environment.api.systemConfiguration.messages.base + `/${email.id}`, email, requestOptions);
  }


}
