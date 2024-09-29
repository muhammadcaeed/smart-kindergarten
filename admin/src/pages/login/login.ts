import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {  NotificationService } from '../../_services/NotificationService';
import { AuthenticationService } from '../../_services/authentication.service';

import { AlertDirective } from '../../_directives/alert';
import { AlertService } from '../../_services/alert.service';

import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-login',
  templateUrl: './login.html',
  providers: [AuthenticationService, AlertService]
})
export class LoginPage {
    // ionViewCanEnter() {
    //     if ( !localStorage.getItem('currentUser') ) return true;
    //     else this.navCtrl.setRoot(DashboardPage);
    // }
    model: any = {};
    loading = false;
    submit = false;
    alert = false;

    constructor(
        public navCtrl: NavController,
        private authenticationService: AuthenticationService,
        private notificationService: NotificationService,
        private alertService: AlertService) { }


    goBack() {
        this.navCtrl.pop(LoginPage);
    }

    login() {
        this.loading = true;
        this.alert = true;
        this.authenticationService.login(this.model.username, this.model.password, 'admin')
            .subscribe(
                data => {
                  console.log('data : ', data);
                  if(data.error) {
                    this.notificationService.notify_warning(data.error);
                    return;
                  }
                    this.navCtrl.setRoot(DashboardPage);
                    this.submit = true;
                },
                error => {
                    this.notificationService.notify_error(error);
                });
                this.loading = false;
    }
}
