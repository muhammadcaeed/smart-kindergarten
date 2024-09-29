import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';
import { ChildrenPage } from '../children/children';

import { AlertDirective } from '../../_directives/alert';

import { UserService } from '../../_services/user.service';
import { NotificationService } from '../../_services/NotificationService';
import { appConfig } from '../../app.config';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-child-registration',
  templateUrl: 'child-registration.html',
  providers: [UserService]
})
export class ChildRegistrationPage {

    child:any = {}; user:any = {};
    loading = false;  submit = false; username_error = false; password_error = false; formError = false; errorText;
    numbers = [2,3,4,5,6,7,8,9,10,11,12];
    constructor(
        public navCtrl: NavController,
        private userService: UserService,
        private notificationService: NotificationService
      ) { }

    goBack() {
        this.navCtrl.pop();
    }
    register(f) {
        console.log('f :', f);
        this.child.avatar_path = appConfig.apiUrl+'/uploads/profile_avatar.png';
        this.child.age = this.child.age.replace(/[^a-zA-Z0-9_]/g, "");
        console.log('this . user : ', this.user);
        console.log('this. child : ', this.child);
        this.loading = true;
        this.userService.createChild(this.user, this.child)
            .subscribe(
                data => {
                    localStorage.setItem('notification', 'Registration successful');
                    this.navCtrl.pop();
                },
                error => {
                    if ( error ) {
                        this.notificationService.notify_error(error);
                        this.formError = true;
                        this.errorText = error;
                    }
            });
            this.loading = this.username_error = this.password_error = false;
    }
}
