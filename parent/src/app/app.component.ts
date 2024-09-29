import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { HomePage } from '../pages/home/home';
// import { HealthPage } from '../pages/health/health';
import { UserService } from '../_services/user.service';
import {ReportsPage} from '../pages/reports/reports';
import { ForgotPage } from '../pages/forgot/forgot';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    private userService: UserService,
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private screenOrientation: ScreenOrientation,
    public push: Push
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.registerPush();
      statusBar.styleDefault();
      splashScreen.hide();

      // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    // if(localStorage.getItem('currentUser')) this.rootPage = ForgotPage;
    if(localStorage.getItem('currentUser')) this.rootPage = DashboardPage;
    else this.rootPage = HomePage;
    });
  }
  registerPush() {
     // Check that we are on a device
   if (this.platform.is('cordova')) {
       // Register push notifications with the push plugin
     this.push.register().then((t: PushToken) => {
       console.log('Generated Token' + JSON.stringify(t));

//register device
if(localStorage.getItem('currentUser')) {
  this.userService.registerDevice(JSON.parse(localStorage.getItem('currentUser'))._id, t.token)
    .subscribe(result => console.log('result :', result));
}
    // this.userService.registerDevice(JSON.parse(localStorage.getItem('currentUser'))._id, JSON.parse(JSON.stringify(t)));

       // Save the user with Ionic's user auth service
       return this.push.saveToken(t);
     }).then( (t: PushToken) => {
       console.log('Token Saved', t);
       // this.listenForPush();
       this.push.rx.notification()
        .subscribe((msg) => {
          alert(msg.title + ': ' + msg.text);
        });
     }).catch( (err) => {
       console.log('Error Saving Token: ' , err);
     });
    }
 }
}
