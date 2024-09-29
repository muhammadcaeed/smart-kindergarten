import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { Autosize } from '../../directives/autosize/autosize';
import {  NotificationService } from '../../_services/NotificationService';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-new-plan',
  templateUrl: 'new-plan.html',
})

export class NewPlanPage {
  form; children; issuesCount= []; i=0; issues: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    public userService: UserService,
    private notificationService:NotificationService,
    private localNotifications: LocalNotifications
  ) {
    this.form = fb.group({
      activity_name: ['', [Validators.required]],
      activity_time: ['', [Validators.required]],
      activity_description: ['', [Validators.required]],
      remind_time: ['', [Validators.required]],
    })
  }
  get activity_name() {return this.form.get('activity_name');}
  get activity_time() {return this.form.get('activity_time');}
  get activity_description() {return this.form.get('activity_description');}
  get remind_time() {return this.form.get('remind_time');}

  ionViewDidLoad() {
    console.log(new Date());
    this.userService.getAllChildren().subscribe(children => { this.children = children; })
  }
  submitForm() {
    let aTime = this.form._value.activity_time.split("");
    let act_time = new Date();
    act_time.setHours(aTime[0] + aTime[1], aTime[3] + aTime[4]);

    this.form._value.activity_time = act_time;

    let rTime = this.form._value.remind_time.split("");
    let rem_time = new Date();
    rem_time.setHours(rTime[0] + rTime[1], rTime[3] + rTime[4]);
    this.form._value.remind_time = rem_time;
    this.userService.newPlan(this.form._value)
    .subscribe(
      res => {
        console.log('rem_time :', rem_time);
        localStorage.setItem('notification', 'Plan created successfully');
        this.localNotifications.schedule({
           text: 'Its time to perform ' + this.form._value.activity_name,
           at: rem_time,
           led: 'FF0000',
        });
        this.navCtrl.pop();
      },
      error => this.notificationService.notify_error(error)
    );
  }

}
