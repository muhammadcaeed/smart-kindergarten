import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationService } from '../../_services/authentication.service';
import { DashboardPage } from '../dashboard/dashboard';
import {  NotificationService } from '../../_services/NotificationService';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import { UserService } from '../../_services/user.service';
import { ForgotPage } from '../forgot/forgot';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  model: any = {};
  loading = false;
  submit = false;
  alert = false;
  constructor(
    private userService: UserService,
    public push: Push,
    public platform: Platform,
    public navCtrl: NavController,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    public navParams: NavParams,
    private ngZone: NgZone
  ) { }
  goBack() {
    this.navCtrl.pop(LoginPage);
 }
 forgot() {
   this.navCtrl.push(ForgotPage);
 }
 login() {
    this.loading = true;
    this.alert = true;
    this.authenticationService.login(this.model.username, this.model.password, "parent")
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
                this.userService.findUserById().subscribe();
                this.navCtrl.setRoot(DashboardPage);
                this.submit = true;
            },
            error => {
                this.notificationService.notify_error(error);
            });
            this.loading = false;
}

}
