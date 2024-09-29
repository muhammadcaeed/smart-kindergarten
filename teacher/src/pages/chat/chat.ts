import { Component, NgZone } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { appConfig } from '../../app.config';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
    messages= [];
    message = '';
    username = JSON.parse(localStorage.getItem('currentUser')).username;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private socket: Socket) {
      this.socket.connect();

      this.getMessages().subscribe(data => {
        this.messages.push(data);
      });
  }

  sendMessage() {
    if (!this.message) {
      console.log('please type something');
    }
    else {
      this.socket.emit('send-message', {
        message: this.message,
        timestamp: Date.now(),
        username: JSON.parse(localStorage.getItem('currentUser')).username
      });
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
