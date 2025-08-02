import {Component, OnInit} from '@angular/core';
import {HclTranslation, HclTranslationService} from '@hacon/hcl';
import {catchError, filter, finalize, Observable, of} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {LoggedUserService} from "./shared/services/logged-user.service";
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "./shared/services/auth.service";
import {MessageService} from "./shared/services/message.service";
import {BaseUrlService} from "./shared/services/base-url.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  protected isLoggedIn: boolean = false;
  protected applicationName = environment.appTitle;
  protected logoUrl;

  constructor(private loggedUserService: LoggedUserService,
              private router: Router,
              private authService: AuthService,
              private messageService: MessageService,
              private translationService: HclTranslationService,
              private http: HttpClient,
              private baseUrlService: BaseUrlService) {

    this.handleError = this.handleError.bind(this);
    this.logoUrl ='assets/img/logos/Hacon_Cube_White.svg';
  }

  ngOnInit(): void {
    this.loadLanguage('en-GB').pipe()
      .subscribe((data: HclTranslation) => {
        this.translationService.addTranslations(data);
      });

    //this.loggedUserService.loginStatusChanged.subscribe(() => {
    //  this.isLoggedIn = this.loggedUserService.isLoggedIn();
    //});

    //this.isLoggedIn = this.loggedUserService.isLoggedIn();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.configureRouteTitles();
      });

    this.baseUrlService.setBaseUrl();
  }



  private handleError(error: any): Observable<any> {
    if (error instanceof HttpErrorResponse && error.status === 0) {
        this.messageService.showError('hcl-login-data.error.connection');
    } else if (error instanceof HttpErrorResponse) {
      this.messageService.showError('hcl-login-data.error.server');
    }
    return of({ error: true, message: error });
  }

  private loadLanguage(lang: string): Observable<HclTranslation> {
    return this.http.get<HclTranslation>('assets/i18n/' + lang + '.json');
  }

  private configureRouteTitles() {
    this.router.config.forEach(route => {
      this.translationService.get('texts.' + route.data?.['titleSelector'] + '.title')
        .subscribe(result => {
          route.title = result;
        });

      if (route.children) {
        route.children.forEach(childRoute => {
          this.translationService.get('texts.' + childRoute.data?.['titleSelector'] + '.title')
            .subscribe(childResult => {
              childRoute.title = childResult;
            });
        });
      }
    });
  }

}
