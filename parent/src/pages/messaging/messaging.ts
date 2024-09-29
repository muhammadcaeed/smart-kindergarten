import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { InboxPage } from '../inbox/inbox';
import { UserService } from '../../_services/user.service';
import { appConfig } from '../../app.config';

@Component({
  selector: 'page-messaging',
  templateUrl: 'messaging.html',
})
export class MessagingPage {
  teachers; searchInput; parentId = JSON.parse(localStorage.getItem('currentUser'))._id;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService
  ) { }

  ionViewDidEnter() {
    this.loadAllTeachers();
  }
  inbox(tId, pId) {
    let data = { 'teacherId' : tId, 'parentId' : pId };
    this.navCtrl.push(InboxPage, data);
  }
  chatGroup() {
    this.navCtrl.push(ChatPage);
  }
  private loadAllTeachers() {
      this.userService.getAllTeachers().subscribe(teachers => { this.teachers = teachers; })
  }
  onInput($event) {
      if (!this.searchInput) this.userService.getAllTeachers().subscribe(teachers => { this.teachers = teachers; })
      this.userService.searchTeachers(this.searchInput).subscribe(teachers => { this.teachers = teachers; });
  }
  errorHandler(event) {
    console.debug(event);
    event.target.src = appConfig.apiUrl+'/uploads/teacher_avatar.png';
  }
}
