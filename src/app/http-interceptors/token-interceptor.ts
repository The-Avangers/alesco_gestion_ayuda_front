import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError, EMPTY} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private router: Router, private notifierService: NotifierService) {
    }

    // tslint:disable-next-line:no-any
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Intercepting');
        const token = localStorage.getItem('token');
        if (token != null) {
            const modifiedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`),
            });

            return next.handle(modifiedReq).pipe(catchError((err: HttpErrorResponse) => {
                console.log(err.status);
                if (err.status === 401) {
                    localStorage.setItem('isAuthenticated', 'false');
                    this.router.navigate(['/register']).then(() => {
                        this.notifierService.show({
                            type: 'error',
                            message: 'Su sesión ha expirado',
                        });
                    });
                }
                return throwError(err);
            }));
        }
        // tslint:disable-next-line:no-any
        return next.handle(req);
    }
}
