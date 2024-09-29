import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { DashboardPage } from '../dashboard/dashboard';
import { AlertDirective } from '../../_directives/alert';
import { AlertService } from '../../_services/alert.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [AlertService, UserService]
})
export class RegisterPage {
    ionViewCanEnter() {
        if ( !localStorage.getItem('currentUser') ) return true;
        else this.navCtrl.setRoot(DashboardPage);
    }
    model:any = {};
    loading = false;
    submit = false;
    alert = false;

    constructor(
        public navCtrl: NavController,
        private userService: UserService,
        private alertService: AlertService) {
        // console.log('signup');
    }
    goBack() {
        this.navCtrl.pop(RegisterPage);
    }
    register() {
        this.loading = true;
        this.alert = true;
        this.model.type = "admin";
        this.userService.create(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.submit = true;
                    // this.navCtrl.push(LoginPage);
                },
                error => {
                    this.alertService.error(error);
                    console.error(error);
            });
            this.loading  = false;
    }
}
