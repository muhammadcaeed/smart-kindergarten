import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ChildrenPage } from '../pages/children/children';
import { TeachersPage } from '../pages/teachers/teachers';
import { ChildRegistrationPage } from '../pages/child-registration/child-registration';
import { TeacherRegistrationPage } from '../pages/teacher-registration/teacher-registration';
import { ChildProfilePage } from '../pages/child-profile/child-profile';
import { EditChildProfilePage } from '../pages/edit-child-profile/edit-child-profile';
import { TeacherProfilePage } from '../pages/teacher-profile/teacher-profile';
import { EditTeacherProfilePage } from '../pages/edit-teacher-profile/edit-teacher-profile';

import { AlertDirective } from '../_directives/alert';
import { ProgressBarComponent } from '../_directives/progress-bar/progress-bar';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Health } from '@ionic-native/health';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

import { HttpModule } from '@angular/http';
import { customHttpProvider } from '../_helpers/custom-http';
import { AuthenticationService } from '../_services/authentication.service';
import {  NotificationService } from '../_services/NotificationService';



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    DashboardPage,
    ChildrenPage,
    TeachersPage,
    ChildRegistrationPage,
    TeacherRegistrationPage,
    ChildProfilePage,
    EditChildProfilePage,
    TeacherProfilePage,
    EditTeacherProfilePage,
    TabsPage,
    AlertDirective,
    ProgressBarComponent,
    FileSelectDirective,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    DashboardPage,
    ChildrenPage,
    TeachersPage,
    ChildRegistrationPage,
    TeacherRegistrationPage,
    ChildProfilePage,
    EditChildProfilePage,
    TeacherProfilePage,
    EditTeacherProfilePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    customHttpProvider,
    AuthenticationService,
    NotificationService,
    Health,
    // UrlHelperService,
    // SecurePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
