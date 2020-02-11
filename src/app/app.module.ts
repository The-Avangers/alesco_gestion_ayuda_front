import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UserRegisterComponent} from './user-register/user-register.component';
import {LoginComponent} from './login/login.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SideBarComponent} from './side-bar/side-bar.component';
import {HttpClientModule} from '@angular/common/http';
import {ProjectListComponent} from './project-list/project-list.component';
import {ProjectsService} from './services/project/projects.service';
import {RouterModule} from '@angular/router';
import { AidListComponent } from './aid-list/aid-list.component';
import {AidService} from './services/aid/aid.service';
import { ProjectFormComponent } from './project-form/project-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InstitutionService} from './services/institution/institution.service';
import {PersonService} from './services/person/person.service';
import {Select2Module} from 'ng2-select2';

@NgModule({
    declarations: [
        AppComponent,
        UserRegisterComponent,
        LoginComponent,
        SideBarComponent,
        ProjectListComponent,
        AidListComponent,
        ProjectFormComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        HttpClientModule,
        Select2Module,
        ReactiveFormsModule,
        RouterModule.forRoot([
            {path: 'register', component: UserRegisterComponent},
            {path: '', component: ProjectListComponent},
            {path: 'projects/add', component: ProjectFormComponent},
            {path: 'projects', component: ProjectListComponent},
            {path: 'aids', component: AidListComponent}
        ]),
        ReactiveFormsModule
    ],
    providers: [
        ProjectsService,
        InstitutionService,
        PersonService,
        AidService
    ],
    bootstrap: [AppComponent],
    entryComponents: [LoginComponent],
})
export class AppModule {
}
