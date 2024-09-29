import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewActivityPage } from '../new-activity/new-activity';
import {  NotificationService } from '../../_services/NotificationService';
import { UserService } from '../../_services/user.service';
import { appConfig } from '../../app.config';

@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html',
})
export class ActivitiesPage {
  activities;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private notificationService:NotificationService,
    private userService: UserService
   ) { }

  ionViewDidEnter() {
    this.userService.getActivities().subscribe(plans => { this.activities = plans; console.log('activities :', this.activities)})
    if(localStorage.getItem('notification')) {
      this.notificationService.notify_success(localStorage.getItem('notification'));
      localStorage.removeItem('notification');
    }
  }

  errorHandler(event) {
        console.debug(event);
        event.target.src = appConfig.apiUrl+'/uploads/profile_avatar.png';
  }
  addNew() {
    this.navCtrl.push(NewActivityPage);
  }

}
