import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) { }
  ionViewCanEnter() {
    //   if ( !localStorage.getItem('currentUser') ) return true;
    //   else this.navCtrl.setRoot(DashboardPage);
  }

  login() {
      this.navCtrl.push(LoginPage);
  }
}
