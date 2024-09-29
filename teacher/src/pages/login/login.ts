import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationService } from '../../_services/authentication.service';
import {  NotificationService } from '../../_services/NotificationService';
import { DashboardPage } from '../dashboard/dashboard';
import { Platform } from 'ionic-angular';
import { UserService } from '../../_services/user.service';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading; alert; model: any = {}; submit = false;
  constructor(
    private userService: UserService,
    public push: Push,
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) { }

  ionViewDidLoad() {
  }
  login() {
    this.loading = true;
    this.alert = true;
    this.authenticationService.login(this.model.username, this.model.password, "teacher")
      .subscribe(
          data => {
            if ( data.error ) {
              this.notificationService.notify_warning(data.error);
              return;
            }
            if (this.platform.is('cordova')) {
                // Register push notifications with the push plugin
              this.push.register().then((t: PushToken) => {

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
              this.navCtrl.setRoot(DashboardPage);
              this.submit = true;
          },
          error => {
              this.notificationService.notify_error(error);
          });
          this.loading = false;
    }
    goBack() {
      this.navCtrl.pop(LoginPage);
    }
}
