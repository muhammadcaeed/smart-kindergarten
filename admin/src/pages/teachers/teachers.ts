import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ChildRegistrationPage } from '../child-registration/child-registration';
import { TeacherProfilePage } from '../teacher-profile/teacher-profile';
import { DashboardPage } from '../dashboard/dashboard';
import { TeacherRegistrationPage } from '../teacher-registration/teacher-registration';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { appConfig } from '../../app.config';
import { NotificationService } from '../../_services/NotificationService';

@Component({
  selector: 'page-teachers',
  templateUrl: 'teachers.html',
  providers: [UserService]
})
export class TeachersPage {
  teachers: any[];

  alert = false; alertText; searchInput;
users: User[] = [];

constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    public alertCtrl: AlertController,
    private notificationService: NotificationService
    ) { }
  goBack() {
      this.navCtrl.pop(TeachersPage);
  }
  addNew() {
      this.navCtrl.push(TeacherRegistrationPage);
  }
  ionViewDidEnter() {
    this.loadAllTeachers();
    if(localStorage.getItem('notification')) {
      this.notificationService.notify_success(localStorage.getItem('notification'));
      localStorage.removeItem('notification');
    }
  }

  private loadAllTeachers() {
      this.userService.getAllTeachers().subscribe(teachers => { this.teachers = teachers; })
  }
  onInput($event) {
      if (!this.searchInput) this.userService.getAllTeachers().subscribe(teachers => { this.teachers = teachers; })
      this.userService.searchTeachers(this.searchInput).subscribe(teachers => { this.teachers = teachers; });
  }

  viewProfile(child_id, user_id) {
      let data = { 'child_id' : child_id, 'user_id' : user_id };
      console.log(data);
      this.navCtrl.push(TeacherProfilePage, data);
  }
  errorHandler(event) {
    console.debug(event);
    event.target.src = appConfig.apiUrl+'/uploads/teacher_avatar.png';
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
                      this.loadAllTeachers();
                      this.userService.deleteTeacher(id).
                        subscribe(
                          data => {
                            this.loadAllTeachers();
                            this.notificationService.notify_success('Account deleted sucessfully')
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
