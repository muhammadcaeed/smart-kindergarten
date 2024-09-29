import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Child } from '../_models/child';
import { User } from '../_models/user';
import { Teacher } from '../_models/teacher';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    deleteTeacher(_id: string) {
        return this.http.delete('/users/teacher/' + _id);
    }
    createTeacher(user: User, teacher:  Teacher) {
        return this.http.post('/users/teacher', [user, teacher]);
    }
    changePasswordAdmin(_id, new_password) {
      return this.http.put('/users/changePasswordAdmin/', [_id, new_password]);
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
    updateTeacher(user: User, teacher: Teacher) {
      return this.http.put('/users/updateteacher/' + user._id, [user, teacher]);
    }
    getAll() {
        return this.http.get('/users').map((response: Response) => response.json());
    }
    getAllChildren() {
        return this.http.get('/users/children').map((response: Response) => response.json());
    }
    getAllTeachers() {
        return this.http.get('/users/teachers').map((response: Response) => response.json());
    }
    getTeacherById(_id: string) {
        return this.http.get('/users/teacher/' + _id).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get('/users/' + _id).map((response: Response) => response.json());
    }
    searchTeachers(tname: string) {
        return this.http.get('/users/searchteachers/' + tname).map((response: Response) => response.json());
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
