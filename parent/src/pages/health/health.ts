import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Health } from '@ionic-native/health';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'page-health',
  templateUrl: 'health.html',
})
export class HealthPage {
  collectData;
  startDate;
  endDate;
  values = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private health: Health,
    private userService: UserService
  ) {
    this.startDate = new Date();
    this.startDate.setHours(23,59,59,59);
    this.endDate = new Date();
    this.endDate.setHours(23,59,59,999);
    console.log('start date :', this.startDate);
    console.log('end date :', this.endDate);
  }

  ionViewDidLoad() {
    this.health.isAvailable()
      .then(
        (available:boolean) => {
          console.log(available);
          this.health.requestAuthorization([
            'distance', 'steps', 'calories', 'heart_rate', 'activity'
          ])
          .then(
            res => {
              console.log(res);

              this.health.queryAggregated({
                startDate: this.startDate,
                endDate: this.endDate,
                dataType: 'steps',
                bucket: 'day'
              })
              .then(
                steps => {
                  this.values["createdAt"] = this.startDate;
                  if(steps && steps[0].value) {
                    this.values["steps"] = steps[0].value;
                    this.values["user_id"] = JSON.parse(localStorage.getItem('currentUser'))._id;
                  }

                  this.health.queryAggregated({
                    startDate: this.startDate,
                    endDate: this.endDate,
                    dataType: 'calories',
                    bucket: 'day'
                  })
                  .then(
                    calories => {
                      if(calories && calories[0].value) this.values["calories"] = calories[0].value;

                      this.health.queryAggregated({
                        startDate: this.startDate,
                        endDate: this.endDate,
                        dataType: 'distance',
                        bucket: 'day'
                      })
                      .then(
                        distance => {
                          if(distance && distance[0].value) this.values["distance"] = distance[0].value;
                          this.health.query({
                            startDate: this.startDate,
                            endDate: this.endDate,
                            dataType: 'heart_rate'
                          })
                          .then(
                            heart_rate => {
                              if(heart_rate && heart_rate[0]) this.values["heart_rate"] = heart_rate[0].value;
                              else this.values["heart_rate"] = 0;
                              this.health.queryAggregated({
                                startDate: this.startDate,
                                endDate: this.endDate,
                                dataType: 'activity',
                                bucket: 'day'
                              })
                              .then(
                                activities => {
                                  console.log('are we here?');
                                  if(activities) {
                                    console.log('activities :', activities);
                                    let activity = JSON.parse(JSON.stringify(activities[0].value));
                                    this.values["sleep"] = 0;

                                    activity["in_vehicle"]  ? this.values["in_vehicle"] = activity["in_vehicle"].duration / 60000 : this.values["in_vehicle"] = 0;
                                    activity["walking"]     ? this.values["walking"]    = activity["walking"].duration / 60000    : this.values["walking"]     = 0;
                                    activity["running"]     ? this.values["running"]    = activity["running"].duration / 60000    : this.values["running"]     = 0;
                                    activity["sleep.light"] ? this.values["sleep"]      = activity["sleep.light"].duration        : this.values["sleep"]          = 0;
                                    activity["sleep.deep"]  ? this.values["sleep"]     += activity["sleep.deep"].duration         : null;
                                    activity["sleep.awake"] ? this.values["sleep"]     += activity["sleep.awake"].duration        : null;
                                    this.values["sleep"] = (this.values["sleep"] / 60000) / 60;
                                  }
                                  this.userService.collectData(this.values).subscribe(
                                    res => console.log('res :', res),
                                    error => console.log('error :', error),
                                  )
                                  console.log('this.values :', this.values);
                                }
                              )
                              .catch(e=>console.log(e));
                            }
                          )
                          .catch(e=>console.log(e));
                        }
                      )
                      .catch(e=>console.log(e));
                    }
                  )
                  .catch(e=>console.log(e));
                }
              )
              .catch(e=> console.log(e));


            }



          )
          .catch(e => console.log(e));
        })
      .catch(e => console.log(e));

    console.log('ionViewDidLoad HealthPage');

  }

}
