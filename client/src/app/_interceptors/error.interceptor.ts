import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              const navigationExtras400: NavigationExtras = {
                state: { error: error.error },
              };

              if (error.error.errors) {
                const modelErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelErrors.push(error.error.errors[key]);
                  }
                }
                if (navigationExtras400.state)
                  navigationExtras400.state['error'] = modelErrors;
              }
              if (request.url.includes('/api/account/register')) {
                this.toastr.error(error.error, error.status.toString());
              } else {
                this.router.navigateByUrl('/bad-request', navigationExtras400);
              }

              break;
            case 401:
              if (request.url.includes('/api/account/login')) {
                this.toastr.error(error.error, error.status.toString());
              } else {
                const navigationExtras: NavigationExtras = {
                  state: { error: error.error },
                };
                this.toastr.error('Unauthorized', error.status.toString());
                
                // this.router.navigateByUrl('/not-authorized', navigationExtras);
              }
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Something unexpected went wrong!');
              console.log(error);
              break;
          }
        }
        throw error;
      })
    );
  }
}
