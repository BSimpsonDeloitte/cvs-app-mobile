import { TestReviewPage } from "./test-review";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { IonicModule, NavController, NavParams, ViewController, AlertController, LoadingController } from "ionic-angular";
import { CommonFunctionsService } from "../../../../providers/utils/common-functions";
import { NavControllerMock, ViewControllerMock, AlertControllerMock, LoadingControllerMock } from "ionic-mocks";
import { StateReformingService } from "../../../../providers/global/state-reforming.service";
import { StateReformingServiceMock } from "../../../../../test-config/services-mocks/state-reforming-service.mock";
import { VehicleService } from "../../../../providers/vehicle/vehicle.service";
import { VehicleServiceMock } from "../../../../../test-config/services-mocks/vehicle-service.mock";
import { VisitService } from "../../../../providers/visit/visit.service";
import { VisitServiceMock } from "../../../../../test-config/services-mocks/visit-service.mock";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { StorageService } from "../../../../providers/natives/storage.service";
import { StorageServiceMock } from "../../../../../test-config/services-mocks/storage-service.mock";
import { TestResultService } from "../../../../providers/test-result/test-result.service";
import { OpenNativeSettings } from "@ionic-native/open-native-settings";
import { TestService } from "../../../../providers/test/test.service";
import { TestServiceMock } from "../../../../../test-config/services-mocks/test-service.mock";
import { NavParamsMock } from "../../../../../test-config/ionic-mocks/nav-params.mock";
import { DefectsService } from "../../../../providers/defects/defects.service";
import { Firebase } from "@ionic-native/firebase";
import { VisitDataMock } from "../../../../assets/data-mocks/visit-data.mock";

describe('Component: TestReviewPage', () => {
  let component: TestReviewPage;
  let fixture: ComponentFixture<TestReviewPage>;
  let visitService: VisitService;
  let testResultServiceSpy: any;
  let alertCtrl: AlertController;

  beforeEach(async(() => {
    testResultServiceSpy = jasmine.createSpyObj('testResultService', ['createTestResult', 'submitTestResult']);

    TestBed.configureTestingModule({
      declarations: [TestReviewPage],
      imports: [IonicModule.forRoot(TestReviewPage)],
      providers: [
        Firebase,
        CommonFunctionsService,
        OpenNativeSettings,
        DefectsService,
        {provide: AlertController, useFactory: () => AlertControllerMock.instance()},
        {provide: LoadingController, useFactory: () => LoadingControllerMock.instance()},
        {provide: TestResultService, useValue: testResultServiceSpy},
        {provide: TestService, useClass: TestServiceMock},
        {provide: StorageService, useClass: StorageServiceMock},
        {provide: ViewController, useFactory: () => ViewControllerMock.instance()},
        {provide: NavController, useFactory: () => NavControllerMock.instance()},
        {provide: StateReformingService, useClass: StateReformingServiceMock},
        {provide: VehicleService, useClass: VehicleServiceMock},
        {provide: VisitService, useClass: VisitServiceMock},
        {provide: NavParams, useClass: NavParamsMock}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReviewPage);
    component = fixture.componentInstance;
    visitService = TestBed.get(VisitService);
    alertCtrl = TestBed.get(AlertController);
  });

  beforeEach(() => {
    spyOn(window.localStorage, 'getItem').and.callFake(function() {
			return JSON.stringify({"test":"test"});
		});
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    alertCtrl = null;
  });

  it('should create the component', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should check the ngOnInit logic', () => {
    component.ngOnInit();
    expect(window.localStorage.getItem).toHaveBeenCalled();
  });

  it('should test submitting a test', () => {
    component.submit(VisitDataMock.VisitTestData);
    expect(alertCtrl.create).toHaveBeenCalled();
  });
});
