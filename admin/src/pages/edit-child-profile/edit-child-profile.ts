import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Child } from '../../_models/child';
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
  selector: 'page-edit-child-profile',
  templateUrl: 'edit-child-profile.html',
  providers: [UserService, NotificationService]
})
export class EditChildProfilePage {
     user: any = {};
     child: any = {};
     set = {};
     form; temp_form: any = {};
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
      cname: ['', [
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
      gname: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
        CustomValidators.cannotContainNumber,
      ]],
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
  get cname() {return this.form.get('cname');}
  get email() {return this.form.get('email');}
  get gname() {return this.form.get('gname');}
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
      this.userService.getById(this.navParams.get('id'))
        .subscribe( result => {
          console.log('result : ', result);
            localStorage.setItem('user', JSON.stringify(result[0]));
            localStorage.setItem('child', JSON.stringify(result[1]));
        });
  }

  updateForm() {
    (<FormGroup>this.form)
    .setValue({
      address: JSON.parse(localStorage.getItem('child')).address,
      cname: JSON.parse(localStorage.getItem('child')).cname,
      gname: JSON.parse(localStorage.getItem('child')).gname,
      mobileno: JSON.parse(localStorage.getItem('child')).mobileno,
      email: JSON.parse(localStorage.getItem('user')).email,
      username: JSON.parse(localStorage.getItem('user')).username
    })
  }

  ionViewDidEnter(form) {
    this.loadUser();
    setTimeout(() =>  {
      this.updateForm();
    }, 100);

    this.uploader = new FileUploader({url:appConfig.apiUrl+'/users/profileImgUpload', authToken: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token});

    this.uploader.onBuildItemForm = (fileItem : any, form: any) => {
      form.append('user_id', this.navParams.get('id'));
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
        event.target.src = appConfig.apiUrl+'/uploads/profile_avatar.png';
  }

  updateChanges() {
    // this.temp_form = this.form._value;
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
                this.user = _.omit(this.form._value, ['address', 'cname', 'gname', 'mobileno']);
                this.user._id = this.navParams.get('id');
                this.child = _.omit(this.form._value, ['email','username']);
                this.child._id = JSON.parse(localStorage.getItem('child'))._id;
                this.userService.updateChild(this.user, this.child)
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
                // return false;
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
            this.notification_service.notify_warning('Passwords must be atleast 8 characters long');
            return false;
          }
          if (data.new_password != data.confirm_password) {
            this.notification_service.notify_warning('Passwords donot match');
            return false;
          }
          this.userService.changePasswordAdmin(
            this.navParams.get('id'),
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



// import { Component, OnInit } from '@angular/core';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { Child } from '../../_models/child';
// import { User } from '../../_models/user';
// import { UserService } from '../../_services/user.service';
// import { NotificationService } from '../../_services/NotificationService';
//
// import { ProgressBarComponent } from '../../_directives/progress-bar/progress-bar';
//
// import { UploadImage } from '../../_models/UploadImage';
// import { Helper } from '../../_helpers/Helper';
// import { HomePage } from '../home/home';
//
// import {FileUploader, FileItem, ParsedResponseHeaders} from "ng2-file-upload";
//
// @Component({
//   selector: 'page-edit-child-profile',
//   templateUrl: 'edit-child-profile.html',
//   providers: [UserService, NotificationService]
// })
// export class EditChildProfilePage implements OnInit {
//
//     ionViewCanEnter() {
//         if ( localStorage.getItem('currentUser') ) return true;
//         else this.navCtrl.setRoot(HomePage);
//     }
//      user: User[] = [];
//      child: Child[] =[];
//     numbers = [2,3,4,5,6,7,8,9,10,11,12];
//     uploader:FileUploader;
//     URL = 'http://localhost:4000/users/profileImgUpload';
//
//   constructor(
//       public navCtrl: NavController,
//       public navParams: NavParams,
//       private userService: UserService,
//       private notification_service: NotificationService
//   ) { }
//   ngOnInit() {
//       this.loadUser();
//       this.uploader = new FileUploader({url:this.URL, authToken: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token});
//
//       this.uploader.onBuildItemForm = (fileItem : any, form: any) => {
//           form.append('user_id', this.navParams.get('id'));
//       }
//
//       this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
//       this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
//     }
//
//       onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
//           let data = JSON.parse(response); //success server response
//           this.notification_service.notify_success('Profile picture changed successfully');
//       }
//
//       onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
//           let error = JSON.parse(response); //error server response
//           this.notification_service.notify_error('Something went wrong');
//       }
//
//   errorHandler(event) {
//       console.debug(event);
//       event.target.src = "http://localhost:4000/uploads/profile_avatar.png";
// }
//
//   private loadUser() {
//       this.userService.getById(this.navParams.get('id'))
//         .subscribe( result => {
//             this.user = result[0];
//             this.child = result[1];
//         });
//   }
// }
