import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  NotificationService } from '../../_services/NotificationService';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../_services/user.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  model: any = {};

  submit = false;

  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    private notificationService: NotificationService,
    public navParams: NavParams
  ) { }
 //  goBack() {
 //    this.navCtrl.pop(LoginPage);
 // }
 forgot() {
   this.userService.forgot(this.model.email, this.model.username)
       .subscribe(
         data => {
           this.notificationService.notify_success('Your password is sent on your email');
           return;
        },
      error => {
        this.notificationService.notify_warning(error);
      }
    )
 }
}
