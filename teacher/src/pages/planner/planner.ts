import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewPlanPage } from '../new-plan/new-plan';
import {  NotificationService } from '../../_services/NotificationService';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'page-planner',
  templateUrl: 'planner.html',
})
export class PlannerPage {
  plans;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private notificationService:NotificationService,
    private userService: UserService
  ) {  }

  ionViewDidEnter() {
    this.userService.getPlans().subscribe(plans => { this.plans = plans; console.log('plans :', this.plans)})
    if(localStorage.getItem('notification')) {
      this.notificationService.notify_success(localStorage.getItem('notification'));
      localStorage.removeItem('notification');
    }
  }
  addNew() {
    this.navCtrl.push(NewPlanPage);
  }

}
