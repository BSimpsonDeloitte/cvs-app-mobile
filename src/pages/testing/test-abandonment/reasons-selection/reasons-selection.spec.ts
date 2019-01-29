import { ReasonsSelectionPage } from "./reasons-selection";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule, NavController, NavParams, ViewController } from "ionic-angular";
import { NavParamsMock } from "../../../../../test-config/ionic-mocks/nav-params.mock";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ViewControllerMock } from "../../../../../test-config/ionic-mocks/view-controller.mock";

describe('Component: ReasonsSelectionPage', () => {
  let component: ReasonsSelectionPage;
  let fixture: ComponentFixture<ReasonsSelectionPage>;
  let navCtrl: NavController;
  let navParams: NavParams;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReasonsSelectionPage],
      imports: [IonicModule.forRoot(ReasonsSelectionPage)],
      providers: [
        NavController,
        {provide: NavParams, useClass: NavParamsMock},
        {provide: ViewController, useClass: ViewControllerMock}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonsSelectionPage);
    component = fixture.componentInstance;
    navCtrl = TestBed.get(NavController);
    navParams = TestBed.get(NavParams);
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('should create the component', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should add or remove a reason out of an array depending on a boolean var', () => {
    expect(component.selectedReasons.length).toEqual(0);
    component.onCheck({text: 'Best reason', isChecked: true});
    expect(component.selectedReasons.length).toEqual(1);
    component.onCheck({text: 'Best reason', isChecked: false});
    expect(component.selectedReasons.length).toEqual(0);
  });

});