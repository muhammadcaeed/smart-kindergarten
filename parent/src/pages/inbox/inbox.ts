import { Component, NgZone } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { appConfig } from '../../app.config';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../_services/user.service';
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {
    messages= [];
    message = '';
    username = JSON.parse(localStorage.getItem('currentUser')).username;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private socket: Socket,
    private userService: UserService
  ) {
    console.log('teacherId :', this.navParams.get('teacherId'));
    console.log('parentId :', this.navParams.get('parentId'));
    this.userService.inbox(this.navParams.get('teacherId'), this.navParams.get('parentId'))
      .subscribe(
        res => console.log('res :', res),
        error => console.log('error :', error)
      );

    this.socket.connect();
    this.socket.emit('add-user', this.navParams.get('parentId'));
    this.socket.on('updatechat', function (username, data) {
      console.log('username :', username);
      console.log('data :', data);

	});

  this.getMessages().subscribe(data => this.messages.push(data));
  }
  
  ionViewDidEnter() {
  //   console.log('teacherId :', this.navParams.get('teacherId'));
  //   console.log('parentId :', this.navParams.get('parentId'));
  //   this.userService.inbox(this.navParams.get('teacherId'), this.navParams.get('parentId'))
  //     .subscribe(
  //       res => console.log('res :', res),
  //       error => console.log('error :', error)
  //     );
  //
  //   this.socket.connect();
  //   this.socket.emit('add-user', this.navParams.get('parentId'));
  //   this.socket.on('updatechat', function (username, data) {
  //     console.log('username :', username);
  //     console.log('data :', data);
  //
	// });
  //
  // this.getMessages().subscribe(data => this.messages.push(data));
  }


  sendMessage() {
    if (!this.message) {
      console.log('please type something');
    }
    else {
      this.socket.emit('sendchat', this.message);
      // this.socket.emit('send-message', {
      //   message: this.message,
      //   timestamp: Date.now(),
      //   username: JSON.parse(localStorage.getItem('currentUser')).username
      // });
      // this.userService.chat({message: this.message,
      // timestamp: Date.now(),
      // username: JSON.parse(localStorage.getItem('currentUser')).username}).subscribe();
      this.message = '';
    }
  }
  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('receive-message', data => observer.next(data));
    })
    return observable;
  }


}
