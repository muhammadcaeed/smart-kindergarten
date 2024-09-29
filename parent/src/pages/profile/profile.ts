import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { NotificationService } from '../../_services/NotificationService';
import { Child } from '../../_models/child';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { appConfig } from '../../app.config';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
     user: User[] = [];
     child: Child[] =[];
  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private notificationService: NotificationService
  ) { }

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
    this.userService.getById(JSON.parse(localStorage.getItem('currentUser'))._id)
      .subscribe( result => {
          this.user = result[0];
          this.child = result[1];
          this.child["avatar_path"] = JSON.parse(localStorage.getItem('currentChild')).avatar_path;
          console.log('this.child : ', this.child);
      });
  }

  editProfile(id) {
      let data ={ 'id' : id }
      this.navCtrl.push(EditProfilePage, data);
  }
}
