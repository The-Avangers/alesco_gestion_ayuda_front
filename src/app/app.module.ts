import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UserRegisterComponent} from './user-register/user-register.component';
import {LoginComponent} from './login/login.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import {IConfig, NgxMaskModule} from 'ngx-mask';
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
import {MatPaginatorModule, MatProgressSpinnerModule, MatTabsModule} from '@angular/material';
import {NgSelect2Module} from 'ng-select2';
import { RequestListComponent } from './request-list/request-list.component';
import { InstitutionListComponent } from './institution-list/institution-list.component';
import { InstitutionFormComponent } from './institution-form/institution-form.component';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonFormComponent } from './person-form/person-form.component';
import { TasksFormComponent } from './tasks-form/tasks-form.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { SortByPipe } from './pipes/sort-by.pipe';
import { RequestFormComponent } from './request-form/request-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskViewComponent } from './task-view/task-view.component';
import {ChartsModule, ThemeService} from 'ng2-charts';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';


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
        AidFormComponent,
        RequestListComponent,
        InstitutionListComponent,
        InstitutionFormComponent,
        PersonListComponent,
        PersonFormComponent,
        TasksFormComponent,
        PaymentFormComponent,
        ProjectViewComponent,
        SortByPipe,
        RequestFormComponent,
        TaskListComponent,
        TaskViewComponent,
        UserListComponent,
        UserFormComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        HttpClientModule,
        NgSelect2Module,
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
                autoHide: 5000,
            }
        }),
        NgxMaskModule.forRoot(),
        RouterModule.forRoot([
            {path: 'register', component: UserRegisterComponent, canActivate: [SessionGuard]},
            localStorage.getItem('Role') === 'Administrador' || localStorage.getItem('Role') === 'Consultor'
                ? {path: '', component: ProjectListComponent, canActivate: [UnauthorizedGuard]}
                : {path: '', component: RequestListComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/institutions', component: InstitutionListComponent, canActivate: [UnauthorizedGuard] },
            {path: 'projects/add', component: ProjectFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/people', component: PersonListComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/:projectId', component: ProjectViewComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/institutions/add', component: InstitutionFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/people/add', component: PersonFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/payment/:projectId', component: PaymentFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/:projectId/tasks', component: TaskListComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/:projectId/tasks/add', component: TasksFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/:projectId/tasks/:taskId', component: TaskViewComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/:projectId/tasks/edit/:taskId', component: TasksFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/institutions/edit/:institutionId', component: InstitutionFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/people/edit/:personId', component: PersonFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects/edit/:projectId', component: ProjectFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'projects', component: ProjectListComponent, canActivate: [UnauthorizedGuard]},
            {path: 'aids', component: AidListComponent, canActivate: [UnauthorizedGuard]},
            {path: 'aids/add', component: AidFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'aids/edit/:aidId', component: AidFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'requests', component: RequestListComponent, canActivate: [UnauthorizedGuard]},
            {path: 'requests/add', component: RequestFormComponent, canActivate: [UnauthorizedGuard]},
            {path: 'users', component: UserListComponent, canActivate: [UnauthorizedGuard]},
            {path: 'users/add', component: UserFormComponent, canActivate: [UnauthorizedGuard]}
        ]),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatTabsModule,
        ChartsModule
    ],
    providers: [
        ProjectsService,
        InstitutionService,
        PersonService,
        UserService,
        AuthService,
        AidService,
        ThemeService,
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
