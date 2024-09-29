import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/user';
import { Plan } from '../_models/plan';
import { Activity } from '../_models/activity';
import { Teacher } from '../_models/teacher';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    sendNotification(msg) {
      console.log('msg :', msg);
      return this.http.post('/users/sendNotification', msg);
    }

    getPlans() {
        return this.http.get('/teachers/getPlans').map((response: Response) => response.json());
    }

    getActivities() {
        return this.http.get('/teachers/getActivities').map((response: Response) => response.json());
    }

    newActivity(activity: Activity) {
      return this.http.post('/teachers/newActivity', activity);
    }

    newPlan(plan: Plan) {
      return this.http.post('/teachers/newPlan', plan);
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
    updateTeacher(user: User, teacher: Teacher) {
      return this.http.put('/teachers/updateTeacher/' + user._id, [user, teacher]);
    }
    getById(_id: string) {
        console.log('ID :', _id);
        return this.http.get('/teachers/' + _id).map((response: Response) => response.json());
    }
    getAllChildren() {
        return this.http.get('/users/children').map((response: Response) => response.json());
    }
    delete(_id: string) {
        return this.http.delete('/users/' + _id);
    }
}
