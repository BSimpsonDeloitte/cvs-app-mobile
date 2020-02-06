import { VehicleModel } from "../../models/vehicle/vehicle.model";
import { CommonRegExp } from "../utils/common-regExp";
import { HTTPService } from "../global/http.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { VisitService } from "../visit/visit.service";
import { TestTypeModel } from "../../models/tests/test-type.model";
import { TechRecordModel, VehicleTechRecordModel } from "../../models/vehicle/tech-record.model";
import { PreparersReferenceDataModel } from "../../models/reference-data-models/preparers.model";
import { CountryOfRegistrationData } from "../../assets/app-data/country-of-registration/country-of-registration.data";
import { TECH_RECORD_STATUS, TEST_TYPE_INPUTS } from "../../app/app.enums";
import { HttpResponse } from "@angular/common/http";

@Injectable()
export class VehicleService {

  constructor(private httpService: HTTPService, public visitService: VisitService) {
  }

  createVehicle(vehicleTechRecord: VehicleTechRecordModel): VehicleModel {
    let newVehicle: VehicleModel = {} as VehicleModel;
    newVehicle.vrm = vehicleTechRecord.vrms.length ? vehicleTechRecord.vrms.find((elem) => elem.isPrimary).vrm : null;
    newVehicle.vin = vehicleTechRecord.vin;
    if (vehicleTechRecord.trailerId) newVehicle.trailerId = vehicleTechRecord.trailerId;
    newVehicle.techRecord = vehicleTechRecord.techRecord[0];
    newVehicle.testResultsHistory = [];
    newVehicle.countryOfRegistration = CountryOfRegistrationData.DefaultCountryData.key;
    newVehicle.euVehicleCategory = null;
    newVehicle.odometerReading = null;
    newVehicle.odometerMetric = null;
    newVehicle.preparerId = null;
    newVehicle.preparerName = null;
    newVehicle.testTypes = [];
    newVehicle.trailerId = vehicleTechRecord.trailerId;
    return newVehicle;
  }

  addTestType(vehicle: VehicleModel, testType: TestTypeModel): void {
    vehicle.testTypes.push(testType);
    this.visitService.updateVisit();
  }

  removeTestType(vehicle: VehicleModel, testType: TestTypeModel): void {
    const foundIndex = vehicle.testTypes.indexOf(testType);
    vehicle.testTypes.splice(foundIndex, 1);
    this.visitService.updateVisit();
  }

  addPreparer(vehicle: VehicleModel, value: PreparersReferenceDataModel): void {
    vehicle.preparerId = value.preparerId;
    vehicle.preparerName = value.preparerName;
    this.visitService.updateVisit();
  }

  getVehicleTechRecord(param, searchCriteria): Observable<HttpResponse<VehicleTechRecordModel>> {
    return this.httpService.getTechRecords(param, searchCriteria);
  }

  getTestResultsHistory(systemNumber: string): Observable<any> {
    return this.httpService.getTestResultsHistory(systemNumber);
  }

  setOdometer(vehicle: VehicleModel, odomReading: string, odomMetric: string): VehicleModel {
    vehicle.odometerReading = odomReading;
    vehicle.odometerMetric = odomMetric;
    this.visitService.updateVisit();
    return vehicle;
  }

  hasOnlyOneTestTypeWithSic(vehicle: VehicleModel) {
    let testsFound = 0;
    for (let testType of vehicle.testTypes) {
      if (testType[TEST_TYPE_INPUTS.SIC_CARRIED_OUT] || testType[TEST_TYPE_INPUTS.SIC_CARRIED_OUT] === false) {
        testsFound++;
      }
    }
    return testsFound === 1;
  }

  removeSicFields(vehicle, fields) {
    if (this.hasOnlyOneTestTypeWithSic(vehicle)) {
      if (fields.hasOwnProperty(TEST_TYPE_INPUTS.SIC_CARRIED_OUT)) delete fields[TEST_TYPE_INPUTS.SIC_CARRIED_OUT];
      if (fields.hasOwnProperty(TEST_TYPE_INPUTS.SIC_SEATBELTS_NUMBER)) delete fields[TEST_TYPE_INPUTS.SIC_SEATBELTS_NUMBER];
      if (fields.hasOwnProperty(TEST_TYPE_INPUTS.SIC_LAST_DATE)) delete fields[TEST_TYPE_INPUTS.SIC_LAST_DATE];
    }
  }

  formatOdometerReadingValue(string: string): string {
    return string ? string.replace(CommonRegExp.ODOMETER_VALUE, ",") : null;
  }

}
