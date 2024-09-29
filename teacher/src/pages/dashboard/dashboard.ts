import { Component,  ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActivitiesPage } from '../activities/activities';
import { HomePage } from '../home/home'
import { PlannerPage } from '../planner/planner';
import { ProfilePage } from '../profile/profile';
import { MessagingPage } from '../messaging/messaging';
import { AuthenticationService } from '../../_services/authentication.service';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
    testUser;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authenticationService: AuthenticationService) { }

  activity() {
    this.navCtrl.push(ActivitiesPage);
  }
  planner() {
    this.navCtrl.push(PlannerPage);
  }
  profile() {
      this.navCtrl.push(ProfilePage);
  }
  messaging() {
    this.navCtrl.push(ChatPage);
  }

  logout() {
      this.authenticationService.logout();
      this.navCtrl.setRoot(HomePage);
  }
}
