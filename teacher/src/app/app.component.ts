import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { HomePage } from '../pages/home/home';
import { UserService } from '../_services/user.service';
import { NewActivityPage } from '../pages/new-activity/new-activity';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';
// import { PlannerPage } from '../pages/planner/planner';
// import { NewPlanPage } from '../pages/new-plan/new-plan';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public push: Push,
    private userService: UserService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.registerPush();
      statusBar.styleDefault();
      splashScreen.hide();

      if(localStorage.getItem('currentUser')) this.rootPage = DashboardPage;
      // if(localStorage.getItem('currentUser')) this.rootPage = NewActivityPage;
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
