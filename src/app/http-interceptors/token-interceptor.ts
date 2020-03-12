import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError, EMPTY} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    // tslint:disable-next-line:no-any
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('INtercepting');
        const token = localStorage.getItem('token');
        if (token != null) {
            const modifiedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`),
            });

            return next.handle(modifiedReq).pipe(catchError((err: HttpErrorResponse) => {
                console.log(err.status);
                if (err.status === 401) {
                    localStorage.setItem('isAuthenticated', 'false');
                }
                return throwError(err);
            }));
        }
        // tslint:disable-next-line:no-any
        return next.handle(req);
    }
}
