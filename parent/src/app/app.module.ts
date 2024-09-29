import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Health } from '@ionic-native/health';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';
import { ActivitiesPage } from '../pages/activities/activities';
import { ChatPage } from '../pages/chat/chat';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { HomePage } from '../pages/home/home';
import { HealthPage } from '../pages/health/health';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { MessagingPage } from '../pages/messaging/messaging';
import { ReportsPage } from '../pages/reports/reports';
import { ForgotPage } from '../pages/forgot/forgot';
import { InboxPage } from '../pages/inbox/inbox';

import { customHttpProvider } from '../_helpers/custom-http';
import { AuthenticationService } from '../_services/authentication.service';
import { NotificationService } from '../_services/NotificationService';
import { UserService } from '../_services/user.service';
import { appConfig } from '../app.config';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: appConfig.socketUrl, options: {} };

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '6d7e0276',
  },
  'push': {
    'sender_id': '716442379485',
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
    ChatPage,
    DashboardPage,
    EditProfilePage,
    FileSelectDirective,
    HomePage,
    HealthPage,
    LoginPage,
    MessagingPage,
    ProfilePage,
    ReportsPage,
    ForgotPage,
    InboxPage
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
    ChatPage,
    DashboardPage,
    EditProfilePage,
    HomePage,
    HealthPage,
    LoginPage,
    MessagingPage,
    ProfilePage,
    ReportsPage,
    ForgotPage,
    InboxPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Health,
    ScreenOrientation,
    customHttpProvider,
    AuthenticationService,
    NotificationService,
    UserService,
    // GooglePlus,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
