import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { Autosize } from '../../directives/autosize/autosize';
import {  NotificationService } from '../../_services/NotificationService';
import { ActivitiesPage } from '../activities/activities';

@Component({
  // moduleId: module.id,
  selector: 'page-new-activity',
  templateUrl: 'new-activity.html',
})
export class NewActivityPage {
  public myForm: FormGroup;
  children;

    constructor(
      public navCtrl: NavController,
      private _fb: FormBuilder,
      private userService: UserService,
      private notificationService:NotificationService
    ) { }

    ngOnInit() {
        this.myForm = this._fb.group({
            name: ['', [Validators.required]],
            perform_time: ['', [Validators.required]],
            description: [''],
            issues: this._fb.array([])
        });
        this.userService.getAllChildren().subscribe(children => { this.children = children; })
    }

    initIssue() {
        return this._fb.group({
            cname: ['', Validators.required],
            detail: ['', Validators.required]
        });
    }

    addIssue() {
        const control = <FormArray>this.myForm.controls['issues'];
        control.push(this.initIssue());
    }

    removeIssue(i: number) {
        const control = <FormArray>this.myForm.controls['issues'];
        control.removeAt(i);
    }

    save(myForm) {
      if (myForm._value.issues.length > 0) {
        for (let i=0; i < myForm._value.issues.length; i++) {
          this.children.find(child => {
            if (child.cname === myForm._value.issues[i].cname) {
              console.log('av path : ', child.avatar_path);
              myForm._value.issues[i].child_id = child._id;
              myForm._value.issues[i].avatar_path = child.avatar_path;
            }
          });
        }
      }
      else {
        delete myForm._value["issues"];
      }
      let pTime = myForm._value.perform_time.split("");
      let pf_time = new Date();
      pf_time.setHours(pTime[0] + pTime[1], pTime[3] + pTime[4]);
      myForm._value.perform_time = pf_time;
      console.log(' final obj :', myForm._value);

      this.userService.newActivity(myForm._value)
        .subscribe(
          res => {
            localStorage.setItem('notification', 'Activity created successfully');
            this.userService.sendNotification({notification: 'New activity performed'})
              .subscribe(
                res => console.log('Notication sent :', res)
              )
            this.navCtrl.pop();
          },
          error => this.notificationService.notify_error(error)
        );
    }
}
