import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/user';
import { Child } from '../_models/child';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    inbox(tId, pId) {
      return this.http.post('/users/inbox', [tId, pId]);
    }

    searchTeachers(tname: string) {
        return this.http.get('/users/searchteachers/' + tname).map((response: Response) => response.json());
    }
    getAllTeachers() {
        return this.http.get('/users/teachers').map((response: Response) => response.json());
    }

    getChat() {
      console.log('get chat service angular');
      return this.http.get('/users/getChat').map((response: Response) => response.json());
    }

    chat(chat) {
      return this.http.post('/users/chat', chat);
    }

    forgot(email, username) {
      return this.http.post('/users/forgot', [email, username]);
    }
    showHealthData(user_id, start, end) {
      return this.http.post('/users/showHealthData', [user_id, start, end]).map((response: Response) => response.json());
    }

    collectData(data) {
      console.log('data :', data);
      return this.http.post('/users/collectData', data);
    }

    findUserById() {
      return this.http.get('/users/findByUserId/' + JSON.parse(localStorage.getItem('currentUser'))._id)
        .map((response: Response) => {
          let child = response.json();
          if(child) localStorage.setItem('currentChild', JSON.stringify(child));
          console.log(localStorage.getItem('currentChild'));
        })
    }
    getActivities() {
        return this.http.get('/teachers/getActivities').map((response: Response) => response.json());
    }
    registerDevice(_id: User, token: string) {
      console.log("register");
      return this.http.post('/users/registerDevice', [_id, token]);
    }
    changePassword(_id, current_password, new_password) {
      return this.http.put('/users/changePassword/', [_id, current_password, new_password]);
    }

    unique(user: User, type: string) {
      return this.http.put('/users/unique/' + user, user);
    }
    confirmation(_id: User, password: User) {
        return this.http.put('/users/confirmation', [_id, password]);
    }
    updateChild(user: User, child: Child) {
      return this.http.put('/users/updatechild/' + user._id, [user, child]);
    }
    getAll() {
        return this.http.get('/users').map((response: Response) => response.json());
    }
    getAllChildren() {
        return this.http.get('/users/children').map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get('/users/' + _id).map((response: Response) => response.json());
    }
    searchChildren(cname: string) {
        return this.http.get('/users/searchchildren/' + cname).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post('/users/register', user);
    }

    createChild(user: User, child:  Child) {
        return this.http.post('/users/child', [user, child]);
    }

    update(user: User) {
        return this.http.put('/users/' + user._id, user);
    }

    delete(_id: string) {
        return this.http.delete('/users/' + _id);
    }
}
