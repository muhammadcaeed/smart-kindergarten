import { Component,  ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChildrenPage } from '../children/children';
import { TeachersPage } from '../teachers/teachers';
import { HomePage } from '../home/home';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
    testUser;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authenticationService: AuthenticationService) { }
  // ionViewCanEnter() {
  //     if ( localStorage.getItem('currentUser') ) {
  //         return true;
  //     }
  //     else this.navCtrl.setRoot(HomePage);
  // }
  children() {
      this.navCtrl.push(ChildrenPage);
  }
  teachers() {
      this.navCtrl.push(TeachersPage);
  }
  logout() {
      this.authenticationService.logout();
      this.navCtrl.setRoot(HomePage);
  }
}
