import {Component, OnInit} from '@angular/core';
import 'metismenu';
// tslint:disable-next-line:no-any
declare let $: any;


@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

    public ariaExpanded = false;

    constructor() {

    }

    ngOnInit() {
        $('#side-menu').metisMenu();
    }

    changeAriaExpanded() {
        this.ariaExpanded = !this.ariaExpanded;
    }

}
