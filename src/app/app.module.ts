import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {NgOptimizedImage} from "@angular/common";
import {
  HCL_DEFAULT_ICON_COLLECTION,
  HclButtonComponent,
  HclFontIconSet,
  HclIconSetCollection,
  HclModalDialogHostDirective,
  HclModule
} from "@hacon/hcl";
import {RequestInterceptor} from "./shared/interceptors/request-interceptor";
import {HclComponentsModule} from "./hcl-components.module";
import {ResponseInterceptor} from "./shared/interceptors/response-interceptor.service";
import { IxModule } from '@siemens/ix-angular';
import { NgxEchartsModule } from 'ngx-echarts';




@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        HclComponentsModule,
        HclModule.forRoot(null),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        NgOptimizedImage,
        HclButtonComponent,
        IxModule.forRoot(),
        HclModalDialogHostDirective,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts')
        })

    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    {
      provide: HCL_DEFAULT_ICON_COLLECTION,
      useFactory: iconFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

export function iconFactory(): HclIconSetCollection {
  const icons: Map<string, HclFontIconSet> = new Map<string, HclFontIconSet>();
  const materialIcons = new HclFontIconSet('content', ['material-icons']);
  icons.set('mat', materialIcons);
  return new HclIconSetCollection(icons);
}

