import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { NotificationService } from '../../_services/NotificationService';
import { Teacher } from '../../_models/teacher';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { appConfig } from '../../app.config';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
     user: User[] = [];
     teacher: Teacher[] =[];
  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private notificationService: NotificationService
  ) { }

  ionViewDidEnter() {
    if(localStorage.getItem('notification')) {
      this.notificationService.notify_success(localStorage.getItem('notification'));
      localStorage.removeItem('notification');
    }
    this.loadUser();
  }

  errorHandler(event) {
    console.debug(event);
    event.target.src = appConfig.apiUrl+'/uploads/teacher_avatar.png';
  }

  private loadUser() {
    console.log('here');
    this.userService.getById(JSON.parse(localStorage.getItem('currentUser'))._id)
      .subscribe( result => {
        console.log(' result : ', result);
          this.user = result[0];
          this.teacher = result[1];
      });
  }

  editProfile(id) {
      let data ={ 'id' : id }
      this.navCtrl.push(EditProfilePage, data);
  }
}
