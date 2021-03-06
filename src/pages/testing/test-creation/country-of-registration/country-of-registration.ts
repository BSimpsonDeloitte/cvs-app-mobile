import { Component, OnInit, ViewChild } from '@angular/core';
import { Events, IonicPage, NavParams, ViewController } from 'ionic-angular';
import { CountryOfRegistrationData } from "../../../../assets/app-data/country-of-registration/country-of-registration.data";
import { CommonFunctionsService } from "../../../../providers/utils/common-functions";
import { VehicleModel } from "../../../../models/vehicle/vehicle.model";
import { VisitService } from "../../../../providers/visit/visit.service";
import { APP } from "../../../../app/app.enums";

@IonicPage()
@Component({
  selector: 'page-country-of-registration',
  templateUrl: 'country-of-registration.html',
})
export class RegionReadingPage implements OnInit {
  @ViewChild('searchBar') searchBar;
  searchVal: string = '';
  topElem = [];
  botElem = [];
  notApplicableElem = [];
  countriesArr = [];
  filteredCountries = [];
  groupedCountries = [];
  vehicle: VehicleModel;
  focusOut: boolean = false;

  constructor(private commonFunctionsService: CommonFunctionsService,
              private viewCtrl: ViewController,
              private navParams: NavParams,
              private visitService: VisitService,
              private events: Events) {
    this.vehicle = this.navParams.get('vehicle');
  }

  ngOnInit(): void {
    this.countriesArr = CountryOfRegistrationData.CountryData;
    this.topElem = this.countriesArr.splice(0, 1);
    this.botElem = this.countriesArr.splice(this.countriesArr.length - 3, 2);
    this.notApplicableElem = this.countriesArr.splice(this.countriesArr.length - 1, 1);
    this.resetFilteredCountries();
  }

  filterCountries(searchVal: string) {
    this.filteredCountries = this.commonFunctionsService.searchFor(this.countriesArr, searchVal, ['key', 'value']);
  }

  resetFilteredCountries() {
    this.filterCountries(this.searchVal);
    this.filteredCountries.sort(this.commonFunctionsService.orderBy('value', 'asc'));
    this.groupedCountries = this.commonFunctionsService.groupArrayAlphabetically(this.filteredCountries, 'value');
  }

  searchList(e): void {
    this.searchVal = e.target.value;
    this.resetFilteredCountries();
  }

  setVehicleRegCountry(regCountryItem) {
    this.focusOut = false;
    this.vehicle.countryOfRegistration = regCountryItem.key;
    this.events.publish(APP.NAV_OUT);
  }

  onSave() {
    this.visitService.updateVisit();
    this.viewCtrl.dismiss();
  }

  keepCancelOn(ev, hideCancel?: boolean) {
    this.focusOut = !hideCancel;
  }
}

