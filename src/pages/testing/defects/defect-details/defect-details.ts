import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VehicleTestModel } from '../../../../models/vehicle-test.model';
import { DefectDetailsModel } from '../../../../models/defects/defect-details.model';
import { DefectsService } from "../../../../providers/defects/defects.service";
import { AdditionalInfoMetadataModel } from "../../../../models/defects/defects-metadata.model";

@IonicPage()
@Component({
  selector: 'page-defect-details',
  templateUrl: 'defect-details.html'
})
export class DefectDetailsPage {
  vehicleTest: VehicleTestModel;
  defect: DefectDetailsModel;
  defectMetadata: AdditionalInfoMetadataModel;
  isEdit: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public defectsService: DefectsService) {
    this.vehicleTest = navParams.get('vehicleTest');
    this.defect = navParams.get('deficiency');
    this.isEdit = navParams.get('isEdit')
    this.defectMetadata = this.defect.metadata.category.additionalInfo;
  }

  addDefect(): void {
    let views = this.navCtrl.getViews();
    for (let i = views.length - 1; i >= 0; i--) {
      if (views[i].component.name == "CompleteTestPage") {
        if(!this.isEdit) this.vehicleTest.addDefect(this.defect);
        this.navCtrl.popTo(views[i]);
      }
    }
  }

  checkIfDefectWasAdded(): boolean {
    let found = false;
    this.vehicleTest.getDefects().forEach(
      defect => {
        if (defect.ref == this.defect.ref) {
          found = true;
        }
      }
    );
    return found;
  }
}
