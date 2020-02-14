import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {NotifierService} from 'angular-notifier';

@Injectable({
    providedIn: 'root'
})
export class UnauthorizedGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(): boolean {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/register']).then(() => false);
        }
        return true;
    }

}
