import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseUrlService {

  /*
    * This method dynamically sets the base URL property in index.html for the application.
    * It is required, because the base path depends on the Spring configuration.
    * Therefore, there is no need to re-build the app for each customer.
    *
    * It extracts the base path from the URL, by picking the elements from the path,
    * excluding the last one, which is the current page (dashboard), and joining them
    * again with a slash. If the base path is empty, it sets it to a single slash (mostly
    * useful in development mode).
   */
  setBaseUrl(): void {
    let baseHref = window.location.pathname
      .split('/')
      .slice(0, -1)
      .join('/');

    if (baseHref == '') {
      baseHref = '/';
    } else {
      baseHref = baseHref + '/';
    }

    let baseElement = document.querySelector('base');
    if (baseElement) {
      baseElement.setAttribute('href', baseHref);
    } else {
      baseElement = document.createElement('base');
      baseElement.setAttribute('href', baseHref);
      document.getElementsByTagName('head')[0].appendChild(baseElement);
    }
  }

}
