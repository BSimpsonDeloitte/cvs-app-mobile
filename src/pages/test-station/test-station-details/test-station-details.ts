import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TestStationReferenceDataModel } from '../../../models/reference-data-models/test-station.model';
import { APP_STRINGS, PAGE_NAMES, AUTH, FIREBASE_SCREEN_NAMES } from "../../../app/app.enums";
import { VisitService } from "../../../providers/visit/visit.service";
import { CallNumber } from "@ionic-native/call-number";
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Firebase } from '@ionic-native/firebase';
import { Subscription } from 'rxjs';
import { AuthService } from "../../../providers/global/auth.service";
import { Store } from "@ngrx/store";
import { Log, LogsModel } from "../../../modules/logs/logs.model";
import * as logsActions from "../../../modules/logs/logs.actions";
import { FirebaseLogsService } from "../../../providers/firebase-logs/firebase-logs.service";
import { AppService } from '../../../providers/global/app.service';

@IonicPage()
@Component({
  selector: 'page-test-station-details',
  templateUrl: 'test-station-details.html'
})
export class TestStationDetailsPage {
  testStation: TestStationReferenceDataModel;
  changeOpacity: boolean = false;
  nextAlert: boolean = false;
  isNextPageLoading: boolean = false;
  startVisitSubscription: Subscription;
  oid: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private callNumber: CallNumber,
              private visitService: VisitService,
              private openNativeSettings: OpenNativeSettings,
              private firebase: Firebase,
              private loadingCtrl: LoadingController,
              private authService: AuthService,
              private store$: Store<LogsModel>,
              private firebaseLogsService: FirebaseLogsService,
              private appService: AppService) {
    this.testStation = navParams.get('testStation');
  }

  ionViewDidEnter() {
    this.firebaseLogsService.setScreenName(FIREBASE_SCREEN_NAMES.TEST_STATION_DETAILS);
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText(APP_STRINGS.SEARCH_TEST_STATION);
  }

  confirmStartVisit() {
    const LOADING = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.isNextPageLoading = true;
    this.oid = this.authService.getOid();
    LOADING.present();
    this.startVisitSubscription = this.visitService.startVisit(this.testStation).subscribe(
      (data) => {
        const log: Log = {
          type: 'info',
          message: `${this.oid} - ${data.status} ${data.statusText} for API call to ${data.url}`,
          timestamp: Date.now(),
        };
        this.store$.dispatch(new logsActions.SaveLog(log));
        this.isNextPageLoading = false;
        LOADING.dismiss();
        this.startVisitSubscription.unsubscribe();
        this.visitService.createVisit(this.testStation, data.body.id);
        this.navCtrl.push(PAGE_NAMES.VISIT_TIMELINE_PAGE, {testStation: this.testStation});
      },
      (error) => {
        const log: Log = {
          type: 'error',
          message: `${this.oid} - ${error.status} ${error.error.error} for API call to ${error.url}`,
          timestamp: Date.now(),
        };
        this.store$.dispatch(new logsActions.SaveLog(log));
        this.isNextPageLoading = false;
        LOADING.dismiss();
        console.error(`Starting activity failed due to: ${error.error.error}`);
        this.firebase.logEvent('test_error', {content_type: 'error', item_id: 'Starting activity failed'});
        if (error && error.error === AUTH.INTERNET_REQUIRED) {
          const TRY_AGAIN_ALERT = this.alertCtrl.create({
            title: APP_STRINGS.UNABLE_TO_START_VISIT,
            message: APP_STRINGS.NO_INTERNET_CONNECTION,
            buttons: [{
              text: APP_STRINGS.SETTINGS_BTN,
              handler: () => {
                this.openNativeSettings.open('settings');
              }
            },
              {
                text: APP_STRINGS.TRY_AGAIN_BTN,
                handler: () => {
                  this.confirmStartVisit();
                }
              }]
          });
          TRY_AGAIN_ALERT.present();
        }
      });
  }

  reportIssueHandler() {
    this.nextAlert = true;
    let alert = this.alertCtrl.create({
      title: APP_STRINGS.REPORT_TITLE,
      message: APP_STRINGS.SPEAK_TO_TTL,
      buttons: [APP_STRINGS.OK]
    });
    alert.present();
    alert.onDidDismiss(() => {
      this.nextAlert = this.changeOpacity = false;
    });
  }

  startVisit(): void {
    this.changeOpacity = true;
    let confirm = this.alertCtrl.create({
      title: APP_STRINGS.TEST_STATION_SAFETY,
      message: `Confirm that you are at ${this.testStation.testStationName} (${this.testStation.testStationPNumber}) and that it is suitable to begin testing before continuing.`,
      cssClass: this.appService.isAccessibilityTextZoomEnabled() ? 'accessibility-limit-message-height' : '',
      buttons: [
        {
          text: APP_STRINGS.CONFIRM,
          cssClass: 'bold-action-button',
          handler: () => {
            this.confirmStartVisit();
          }
        },
        {
          text: APP_STRINGS.REPORT_ISSUE,
          cssClass: 'danger-action-button',
          handler: () => {
            this.reportIssueHandler();
          }
        },
        {
          text: APP_STRINGS.CANCEL,
          cssClass: 'not-bold-action-button'
        }
      ]
    });
    confirm.present();
    confirm.onDidDismiss(() => {
      if (!this.nextAlert) {
        this.changeOpacity = false;
      }
    });
  }

  callPhoneNumber(): void {
    let confirm = this.alertCtrl.create({
      title: `${this.testStation.testStationContactNumber}`,
      buttons: [
        {
          text: APP_STRINGS.CANCEL
        },
        {
          text: APP_STRINGS.CALL,
          handler: () => {
            this.callNumber.callNumber(this.testStation.testStationContactNumber, true);
          }
        }
      ]
    });
    confirm.present();
  }
}
