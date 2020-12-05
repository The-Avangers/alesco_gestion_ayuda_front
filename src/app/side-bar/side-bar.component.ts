import {Component, OnInit} from '@angular/core';
import 'metismenu';
import {Router} from '@angular/router';
import {User} from '../services/user/user.interface';
import {AuthService} from '../services/auth.service';

// tslint:disable-next-line:no-any
declare let $: any;


@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

    public ariaExpanded =  {
        project: false,
        aid: false,
        request: false,
        user: false

    };
    public isAuthenticated = false;
    public user: User;
    public miniNavBar: boolean;

    constructor(private router: Router) {
    }


    ngOnInit() {
        this.isAuthenticated = Boolean(localStorage.getItem('isAuthenticated'));
        this.user = JSON.parse(localStorage.getItem('User') );
        console.log(this.isAuthenticated);
        setTimeout(() => $('#side-menu').metisMenu(), 0);
    }

    changeAriaExpanded(type: string) {
        switch (type) {
            case 'project': this.ariaExpanded.project = !this.ariaExpanded.project;
                            this.ariaExpanded.aid = false;
                            this.ariaExpanded.request = false;
                            this.ariaExpanded.user = false;
                            break;
            case 'aid': this.ariaExpanded.aid = !this.ariaExpanded.aid;
                        this.ariaExpanded.project = false;
                        this.ariaExpanded.request = false;
                        this.ariaExpanded.user = false;
                        break;
            case 'request': this.ariaExpanded.request = !this.ariaExpanded.request;
                            this.ariaExpanded.project = false;
                            this.ariaExpanded.aid = false;
                            this.ariaExpanded.user = false;
                            break;
            case 'user': this.ariaExpanded.user = !this.ariaExpanded.user;
                         this.ariaExpanded.project = false;
                         this.ariaExpanded.aid = false;
                         this.ariaExpanded.request = false;
                         break;
            default: for (let value of Object.values(this.ariaExpanded) ) {
                value = false;
            }
        }
    }

    get role(): string {
        return AuthService.getRole();
    }

    collapseNavBar() {
        this.miniNavBar = !this.miniNavBar;
    }

    logout() {
        localStorage.removeItem('isAuthenticated');
        this.router.navigate([ '/register']).then();
    }

}
