import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';
import { ActivitiesPage } from '../pages/activities/activities';
import { NewActivityPage } from '../pages/new-activity/new-activity';
import { ChatPage } from '../pages/chat/chat';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { PlannerPage } from '../pages/planner/planner';
import { NewPlanPage } from '../pages/new-plan/new-plan';
import { MessagingPage } from '../pages/messaging/messaging';
import { AuthenticationService } from '../_services/authentication.service';
import {  NotificationService } from '../_services/NotificationService';
import { HttpModule } from '@angular/http';
import { customHttpProvider } from '../_helpers/custom-http';
import { UserService } from '../_services/user.service';
// import { ForgotPage } from '../pages/forgot/forgot';
import { Autosize } from '../directives/autosize/autosize';
import { appConfig } from '../app.config';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: appConfig.socketUrl, options: {} };
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'ed3c01bc',
  },
  'push': {
    'sender_id': '651247298343',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};


@NgModule({
  declarations: [
    MyApp,
    ActivitiesPage,
    NewActivityPage,
    ChatPage,
    DashboardPage,
    EditProfilePage,
    FileSelectDirective,
    HomePage,
    LoginPage,
    MessagingPage,
    ProfilePage,
    PlannerPage,
    NewPlanPage,
    Autosize,
    // ForgotPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ActivitiesPage,
    NewActivityPage,
    ChatPage,
    DashboardPage,
    EditProfilePage,
    HomePage,
    LoginPage,
    MessagingPage,
    ProfilePage,
    PlannerPage,
    NewPlanPage,
    // ForgotPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService,
    NotificationService,
    customHttpProvider,
    LocalNotifications,
    UserService,
    // Autosize,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
