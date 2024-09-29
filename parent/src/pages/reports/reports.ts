import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../_services/user.service';
import { appConfig } from '../../app.config';

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
  startDate; endDate; data; dataA; dataB; currentChild;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService:UserService
  ) {}

  errorHandler(event) {
        console.debug(event);
        event.target.src = appConfig.apiUrl+'/uploads/profile_avatar.png';
  }

  search() {
    let sDate = this.startDate.toString().substr(8,2);
    let sMonth = this.startDate.toString().substr(5,2);
    let sYear  = this.startDate.toString().substr(0,4);
    let eDate = this.endDate.toString().substr(8,2);
    let eMonth = this.endDate.toString().substr(5,2);

    let start = new Date();
    start.setHours(0,0,0);
    start.setDate(sDate);
    start.setMonth(sMonth - 1);
    start.setFullYear(sYear);
    let end = new Date();

    end.setHours(23,59,59,999);
    end.setDate(eDate);
    end.setMonth(eMonth - 1);

    this.userService.showHealthData(JSON.parse(localStorage.getItem('currentUser'))._id, start, end).subscribe(
      res => {
        this.dataA = res[0];
        this.dataB = res[1];
        console.log(JSON.parse(JSON.stringify(res[1])));
        // this.data = getAllDays();

        console.log(res);
      },
      error => console.log(error)
    );
  }
  ionViewDidLoad() {
    this.currentChild = JSON.parse(localStorage.getItem('currentChild'))._id;
    console.log('this child : ', this.currentChild);

    console.log('ionViewDidLoad ReportsPage');
  }

}
