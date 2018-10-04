import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {VehicleService} from '../../../../services/vehicle.service';
import {TestReportModel} from '../../../../models/test-report.model';
import {VisitModel} from '../../../../models/visit.model';
import {VehicleModel} from "../../../../models/vehicle.model";

@IonicPage()
@Component({
  selector: 'page-vehicle-lookup',
  templateUrl: 'vehicle-lookup.html'
})
export class VehicleLookupPage {
  testReport: TestReportModel;
  visit: VisitModel;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private vehicleService: VehicleService) {
    this.testReport = navParams.get('testReport');
    this.visit = navParams.get('visit');
  }

  searchVehicle(ev: any): void {
    let searchedValue = ev.target.value;

    this.vehicleService.searchVehicle(searchedValue)
      .subscribe(
        (vehicleFound: VehicleModel) => {
          if (vehicleFound != null) {
            this.navCtrl.push('VehicleDetailsPage', {
                testReport: this.testReport,
                vehicle: vehicleFound
              }
            );
          }
        }
      );
  }

  close(): void {
    if (this.navCtrl.getPrevious().component.name == 'VisitTimelinePage') {
      this.visit.removeTestReport(this.testReport);
    }
    this.navCtrl.pop();
  }
}
