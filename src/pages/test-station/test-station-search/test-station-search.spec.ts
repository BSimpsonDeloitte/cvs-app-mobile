import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { Events, IonicModule, NavController } from "ionic-angular";
import { TestStationSearchPage } from "./test-station-search";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestStationService } from "../../../providers/test-station/test-station.service";
import { FirebaseLogsService } from "../../../providers/firebase-logs/firebase-logs.service";
import { FirebaseLogsServiceMock } from "../../../../test-config/services-mocks/firebaseLogsService.mock";

describe('Component: TestStationSearchPage', () => {
  let comp: TestStationSearchPage;
  let fixture: ComponentFixture<TestStationSearchPage>;
  let testStationService: TestStationService;
  let navCtrl: NavController;
  let firebaseLogsService: FirebaseLogsService;

  beforeEach(async(() => {
    const testStationServiceSpy = jasmine.createSpyObj('TestStationService', ['getTestStations, getTestStationsFromStorage']);

    TestBed.configureTestingModule({
      declarations: [TestStationSearchPage],
      imports: [
        IonicModule.forRoot(TestStationSearchPage)
      ],
      providers: [
        NavController,
        {provide: TestStationService, useValue: testStationServiceSpy},
        {provide: FirebaseLogsService, useClass: FirebaseLogsServiceMock}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStationSearchPage);
    comp = fixture.componentInstance;
    testStationService = TestBed.get(TestStationService);
    navCtrl = TestBed.get(NavController);
    firebaseLogsService = TestBed.get(FirebaseLogsService);
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    testStationService = null;
  });

  it('should create component', (done) => {
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();
    expect(testStationService).toBeTruthy();
    done();
  });

  it('should test ionViewDidEnterLogic', () => {
    spyOn(firebaseLogsService, 'setScreenName');
    comp.ionViewDidEnter();
    expect(firebaseLogsService.setScreenName).toHaveBeenCalled();
  });

  it('should TestStationService and TestStationSearchPage Component share the same instance',
    inject([TestStationService], (injectService: TestStationService) => {
      expect(injectService).toBe(testStationService);
    })
  );

  it('should test keepCancelOn method', () => {
    expect(comp.focusOut).toBeFalsy();
    comp.keepCancelOn('ev');
    expect(comp.focusOut).toBeTruthy();
    comp.keepCancelOn('ev', true);
    expect(comp.focusOut).toBeFalsy();
  });
});
