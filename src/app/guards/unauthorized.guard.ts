import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {NotifierService} from 'angular-notifier';
import {ProjectsService} from '../services/project/projects.service';

@Injectable({
    providedIn: 'root'
})
export class UnauthorizedGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private projectsService: ProjectsService) {
    }

    canActivate(): boolean {
        this.projectsService.getProjectById(1).subscribe(res => {
            console.log(this.authService.isAuthenticated());
            if (!this.authService.isAuthenticated()) {
                this.router.navigate(['/register']).then(() => false);
            }
        }, error => {
            console.log(this.authService.isAuthenticated());
            if (!this.authService.isAuthenticated()) {
                this.router.navigate(['/register']).then(() => false);
            }
        });
        return true;
    }

}


