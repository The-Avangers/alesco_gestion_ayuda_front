import {Component, OnInit} from '@angular/core';
import 'metismenu';
import {Router} from '@angular/router';
import {hasOwnProperty} from 'tslint/lib/utils';
import {iterator} from 'rxjs/internal-compatibility';
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
        aid: false

    };
    public isAuthenticated = false;

    constructor(private router: Router) {
    }

    async ngOnInit() {
        this.isAuthenticated = Boolean(localStorage.getItem('isAuthenticated'));
        console.log(this.isAuthenticated);
        if (!this.isAuthenticated) {
            await this.router.navigate(['/register']);
        }
        $('#side-menu').metisMenu();
    }

    changeAriaExpanded(type: string) {
        switch (type) {
            case 'project': this.ariaExpanded.project = !this.ariaExpanded.project;
                            this.ariaExpanded.aid = false;
                            break;
            case 'aid': this.ariaExpanded.aid = !this.ariaExpanded.aid;
                        this.ariaExpanded.project = false;
                        break;
            default: for (let value of Object.values(this.ariaExpanded) ) {
                value = false;
            }
        }
    }

}
