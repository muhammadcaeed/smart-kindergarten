import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditTeacherProfilePage } from '../edit-teacher-profile/edit-teacher-profile';
import { Teacher } from '../../_models/teacher';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { NotificationService } from '../../_services/NotificationService';

import { appConfig } from '../../app.config';

@Component({
  selector: 'page-teacher-profile',
  templateUrl: 'teacher-profile.html',
  providers: [UserService]
})
export class TeacherProfilePage {

 user: User[] = [];
 teacher: Teacher[] =[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
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
      this.userService.getTeacherById(this.navParams.get('user_id'))
        .subscribe( result => {
            this.user = result[0];
            this.teacher = result[1];
        });
  }

  editProfile(id) {
      let data ={ 'id' : id }
      this.navCtrl.push(EditTeacherProfilePage, data);
  }
}
