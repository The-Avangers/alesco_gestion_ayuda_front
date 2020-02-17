import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UserRegisterComponent} from './user-register/user-register.component';
import {LoginComponent} from './login/login.component';
import {NgbAlertModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SideBarComponent} from './side-bar/side-bar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ProjectListComponent} from './project-list/project-list.component';
import {ProjectsService} from './services/project/projects.service';
import {RouterModule} from '@angular/router';
import { AidListComponent } from './aid-list/aid-list.component';
import {AidService} from './services/aid/aid.service';
import { ProjectFormComponent } from './project-form/project-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InstitutionService} from './services/institution/institution.service';
import {PersonService} from './services/person/person.service';
import {Select2Module} from 'ng2-select2';
import {NgxMaskModule} from 'ngx-mask';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {NotifierModule} from 'angular-notifier';
import {FilterTablePipe} from './pipes/filterTable.pipe';
import {UserService} from './services/user/user.service';
import {AuthService} from './services/auth.service';
import {UnauthorizedGuard} from './guards/unauthorized.guard';
import {TokenInterceptor} from './http-interceptors/token-interceptor';
import {SessionGuard} from './guards/session.guard';
import {AidFormComponent} from './aid-form/aid-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule, ProgressSpinnerMode} from "@angular/material";

@NgModule({
    declarations: [
        AppComponent,
        UserRegisterComponent,
        LoginComponent,
        SideBarComponent,
        ProjectListComponent,
        AidListComponent,
        FilterTablePipe,
        ProjectFormComponent,
        AidFormComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        HttpClientModule,
        Select2Module,
        ReactiveFormsModule,
        FormsModule,
        CurrencyMaskModule,
        NotifierModule.withConfig({
            position: {
                vertical: {
                    position: 'top',
                    distance: 20,
                },
                horizontal: {
                    position: 'middle'
                }
            },
            behaviour: {
                onClick: 'hide',
                autoHide: 15000,
            }
        }),
        NgxMaskModule.forRoot(),
        RouterModule.forRoot([
            {path: 'register', component: UserRegisterComponent, canActivate: [SessionGuard]},
            {path: '', component: ProjectListComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/add', component: ProjectFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects', component: ProjectListComponent, canActivate: [UnauthorizedGuard]},
            {path: 'aids', component: AidListComponent, canActivate: [UnauthorizedGuard]},
            {path: 'aids/add', component: AidFormComponent, canActivate: [UnauthorizedGuard]}
        ]),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
    ],
    providers: [
        ProjectsService,
        InstitutionService,
        PersonService,
        UserService,
        AuthService,
        AidService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
    entryComponents: [LoginComponent],
})
export class AppModule {
}
