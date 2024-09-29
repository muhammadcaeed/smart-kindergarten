  import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ChildrenService } from './children.service';
import { ChildRegistrationPage } from '../child-registration/child-registration';
import { ChildProfilePage } from '../child-profile/child-profile';
import { DashboardPage } from '../dashboard/dashboard';
import { appConfig } from '../../app.config';

import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { NotificationService } from '../../_services/NotificationService';
@Component({
  selector: 'page-children',
  templateUrl: 'children.html',
  providers: [ChildrenService, UserService]
})

export class ChildrenPage {
    alert = false; alertText; searchInput;
  users: User[] = [];

  children: any[];

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private userService: UserService,
      private _childrenService: ChildrenService,
      public alertCtrl: AlertController,
      private notificationService: NotificationService
    ) { }

    ionViewDidEnter() {
      this.loadAllChildren();
      if(localStorage.getItem('notification')) {
        this.notificationService.notify_success(localStorage.getItem('notification'));
        localStorage.removeItem('notification');
      }
    }
    // ionViewCanEnter() {
    //     if (this.navParams.get('alert')  == true) this.alertDisplay(this.navParams.get('alertText'));
    // }

    private loadAllChildren() {
        this.userService.getAllChildren().subscribe(children => { this.children = children; })
    }
    onInput($event) {
        if (!this.searchInput) this.userService.getAllChildren().subscribe(children => { this.children = children; })
        this.userService.searchChildren(this.searchInput).subscribe(children => { this.children = children; });
    }

  goBack() {
      this.navCtrl.popToRoot();
  }
  addNew() {
      this.navCtrl.push(ChildRegistrationPage);
  }
  viewProfile(child_id, user_id) {
      let data = { 'child_id' : child_id, 'user_id' : user_id };
      console.log(data);
      this.navCtrl.push(ChildProfilePage, data);
  }
  errorHandler(event) {
    console.debug(event);
    event.target.src = appConfig.apiUrl+'/uploads/profile_avatar.png';
  }
  alertDisplay(text) {
      this.alertText = text;
      this.alert = true;

      setTimeout(() => {
          this.alert  = !this.alert;
          this.alertText = '';
      }, 6000);
  }
  confirmDelete(id) {
      console.log('delete id : ', id);

      let confirm = this.alertCtrl.create({
          title: 'Delete',
          message: 'Are you sure?',
          buttons: [
              {
                  text: 'Yes',
                  handler: data => {
                      this.loadAllChildren();
                      this.userService.delete(id).
                        subscribe(
                            data => {
                              this.loadAllChildren();
                              this.notificationService.notify_success('Account deleted sucessfully');
                            },
                            error => this.notificationService.notify_error('Something went wrong. Try again.')
                        );
                  }
              },
              { text: 'No' }
          ]
      });
      confirm.present();
  }
}
