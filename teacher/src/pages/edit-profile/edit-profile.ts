import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Teacher } from '../../_models/teacher';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { NotificationService } from '../../_services/NotificationService';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from './custom.validators';

import { Helper } from '../../_helpers/Helper';

import {FileUploader, FileItem, ParsedResponseHeaders} from "ng2-file-upload";
import { appConfig } from '../../app.config';

import * as _ from 'underscore';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
     user: any = {};
     teacher: any = {};
     set = {};
     form;
    numbers = [2,3,4,5,6,7,8,9,10,11,12];
    uploader:FileUploader;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private userService: UserService,
      private notification_service: NotificationService,
      private alertCtrl: AlertController,
      private fb: FormBuilder
  ) {
    this.form = fb.group({
      address: ['', [Validators.required]],
      tname: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
        CustomValidators.cannotContainNumber,
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ],
      this.shouldBeUnique.bind(this)
    ],
      mobileno: ['', [
        Validators.required,
        Validators.pattern('[03]{2}[0-9]{9}')
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        CustomValidators.cannotContainSpace,
        CustomValidators.cannotStartWithNumber
      ],
      this.shouldBeUnique.bind(this)
  ]
    })
  }
  get address() {return this.form.get('address');}
  get tname() {return this.form.get('tname');}
  get email() {return this.form.get('email');}
  get mobileno() {return this.form.get('mobileno');}
  get username() {return this.form.get('username');}

  shouldBeUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {

      setTimeout(() => {
        if (control.dirty && (control.value as string).indexOf('@') >= 0) {
          this.userService.unique(control.value, 'email')
            .subscribe(
              () => { console.log('found'); resolve({ 'shouldBeUnique': true }); },
              () => { console.log('not found'); resolve(null); });
            }
        if (control.dirty && control.value != JSON.parse(localStorage.getItem('user')).username) {
          this.userService.unique(control.value, 'username')
            .subscribe(
              () => { console.log('found'); resolve({ 'shouldBeUnique': true }); },
              () => { console.log('not found'); resolve(null); });
            }
      }, 1000);
    });
    return q;
  }

  private loadUser() {
      this.userService.getById(JSON.parse(localStorage.getItem('currentUser'))._id)
        .subscribe( result => {
            localStorage.setItem('user', JSON.stringify(result[0]));
            localStorage.setItem('teacher', JSON.stringify(result[1]));
        });
  }

  updateForm() {
    console.log('update');
    (<FormGroup>this.form)
    .setValue({
      address: JSON.parse(localStorage.getItem('teacher')).address,
      tname: JSON.parse(localStorage.getItem('teacher')).tname,
      mobileno: JSON.parse(localStorage.getItem('teacher')).mobileno,
      email: JSON.parse(localStorage.getItem('user')).email,
      username: JSON.parse(localStorage.getItem('user')).username
    })
  }

  ionViewDidEnter(form) {
    console.log('url :', appConfig.apiUrl);
    console.log(JSON.parse(localStorage.getItem('teacher')));
    let t = JSON.parse(localStorage.getItem('teacher'));
    if(t && t.avatar_path) this.teacher.avatar_path = JSON.parse(localStorage.getItem('teacher')).avatar_path;
    this.loadUser();
    setTimeout(() =>  {
      this.updateForm();
    }, 100);

    this.uploader = new FileUploader({url:appConfig.apiUrl+'/users/profileImgUpload', authToken: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token});

    this.uploader.onBuildItemForm = (fileItem : any, form: any) => {
      form.append('user_id', this.navParams.get('id'));
      form.append('type', 'teacher');
      form.append('path', appConfig.apiUrl);
    }

    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
      let data = JSON.parse(response); //success server response
      if (data.err_code) this.notification_service.notify_warning(data.err_desc);
      else {
        localStorage.setItem('notification', 'Profile picture changed successfully');
        this.navCtrl.pop();
      }
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
      let error = JSON.parse(response); //error server response
      this.notification_service.notify_error('Something went wrong');
  }

  errorHandler(event) {
        console.debug(event);
        event.target.src = appConfig.apiUrl+'/uploads/teacher_avatar.png';
  }

  updateChanges() {
    const alert = this.alertCtrl.create({
    title: 'Confirm Password',
    inputs: [
      {
        name: 'password',
        placeholder: 'Password',
        type: 'password'
      }
    ],
    buttons: [
      {
        text: 'Confirm',
        handler: data => {
          this.userService.confirmation(JSON.parse(localStorage.getItem('currentUser'))._id, data.password)
            .subscribe(
              data => {
                this.user = _.omit(this.form._value, ['address', 'tname', 'mobileno']);
                this.user._id = JSON.parse(localStorage.getItem('currentUser'))._id;
                this.teacher = _.omit(this.form._value, ['email','username']);
                this.teacher._id = JSON.parse(localStorage.getItem('teacher'))._id;
                this.userService.updateTeacher(this.user, this.teacher)
                  .subscribe(
                    data => {
                      localStorage.setItem('notification', 'Profile updated successfully');
                      this.navCtrl.pop();
                    },
                    error => {
                      this.notification_service.notify_warning('Something went wrong. Try again');
                    }
                  )
              },
              error => {
                this.notification_service.notify_warning(error);
              }
            )
            this.loadUser();
          }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  alert.present();
  }


  changePassword() {
    const alert = this.alertCtrl.create({
    title: 'Change Password',
    inputs: [
      {
        name: 'current_password',
        placeholder: 'Old password',
        type: 'password'
      },
      {
        name: 'new_password',
        placeholder: 'New password',
        type: 'password'
      },
      {
        name: 'confirm_password',
        placeholder: 'Confirm password',
        type: 'password'
      },
    ],
    buttons: [
      {
        text: 'Confirm',
        handler: data => {
          if(data.new_password.length < 5) {
            this.notification_service.notify_warning('Passwords must be atleast 5 characters long');
            return false;
          }
          if(data.current_password == data.new_password) {
            this.notification_service.notify_warning('New password should be different from current');
            return false;
          }
          if (data.new_password != data.confirm_password) {
            this.notification_service.notify_warning('Passwords donot match');
            return false;
          }
          this.userService.changePassword(
            JSON.parse(localStorage.getItem('currentUser'))._id,
            data.current_password,
            data.new_password)
            .subscribe(
              data => {
                localStorage.setItem('notification', 'Password changed successfully');
                this.navCtrl.pop();
              },
              error => {
                this.notification_service.notify_warning(error);
                return false;
              })
          }
      },
      { text: 'Cancel', role: 'cancel' }
    ]
  });
  alert.present();
  }
}
