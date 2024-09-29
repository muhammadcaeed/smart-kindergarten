import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { EditChildProfilePage } from '../edit-child-profile/edit-child-profile';
import { NotificationService } from '../../_services/NotificationService';

import { Child } from '../../_models/child';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';

import { appConfig } from '../../app.config';

@Component({
  selector: 'page-child-profile',
  templateUrl: 'child-profile.html',
  providers: [UserService]
})
export class ChildProfilePage {
  user: User[] = [];
  child: Child[] =[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
  }

  ionViewDidEnter() {
    console.log('entered');
    if(localStorage.getItem('notification')) {
      this.notificationService.notify_success(localStorage.getItem('notification'));
      localStorage.removeItem('notification');
    }
    this.loadUser();
  }


  errorHandler(event) {
      console.debug(event);
      event.target.src = appConfig.apiUrl+'/uploads/profile_avatar.png';
}

  private loadUser() {
      this.userService.getById(this.navParams.get('user_id'))
        .subscribe( result => {
            this.user = result[0];
            this.child = result[1];
        });
  }

  editProfile(id) {
      let data ={ 'id' : id }
      this.navCtrl.push(EditChildProfilePage, data);
  }
}
