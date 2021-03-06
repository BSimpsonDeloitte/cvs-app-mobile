import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { AppService } from "./app.service";
import { Platform, ToastController } from "ionic-angular";
import { ToastControllerMock } from "ionic-mocks";
import { StorageService } from "../natives/storage.service";
import { StorageServiceMock } from "../../../test-config/services-mocks/storage-service.mock";
import { AuthServiceMock } from "../../../test-config/services-mocks/auth-service.mock";
import { APP, LOCAL_STORAGE } from "../../app/app.enums";

describe(`AppService: `, () => {
  let appService: AppService;
  let platform: Platform;
  let toast: ToastController;
  let storageService: StorageService;
  let authService: AuthService;

  let platformSpy: any;

  beforeEach(() => {
    platformSpy = jasmine.createSpyObj('Platform', ['is']);
    platformSpy.is.and.returnValue(true);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AppService,
        {provide: Platform, useValue: platformSpy},
        {provide: ToastController, useFactory: () => ToastControllerMock.instance()},
        {provide: StorageService, useClass: StorageServiceMock},
        {provide: AuthService, useClass: AuthServiceMock},
      ],
    });
    platform = TestBed.get(Platform);
    toast = TestBed.get(ToastController);
    storageService = TestBed.get(StorageService);
    authService = TestBed.get(AuthService);

    let store = {};
    const MOCK_LOCAL_STORAGE = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem')
      .and.callFake(MOCK_LOCAL_STORAGE.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(MOCK_LOCAL_STORAGE.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(MOCK_LOCAL_STORAGE.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(MOCK_LOCAL_STORAGE.clear);
  });

  afterEach(() => {
    appService = null;
    platform = null;
    toast = null;
    storageService = null;
    authService = null;
    localStorage.clear();
  });

  it('should start AppService', () => {
    expect(appService).toBeFalsy();

    appService = new AppService(platform, toast, storageService, authService);

    expect(appService).toBeTruthy();
  });

  it("should set AppServices's readonly flags", () => {
    appService = new AppService(platform, toast, storageService, authService);

    expect(appService.isCordova).toBeTruthy();
    expect(appService.isProduction).toBeFalsy();
    expect(appService.isInitRunDone).toBeFalsy();
  });

  it("should set AppService's flags to false if on first run", () => {
    appService = new AppService(platform, toast, storageService, authService);
    localStorage.clear();
    appService.setFlags();

    expect(appService.isSignatureRegistered).toBeFalsy();
    expect(appService.caching).toBeFalsy();
    expect(appService.easterEgg).toBeFalsy();
    expect(appService.isInitSyncDone).toBeFalsy();
    expect(appService.isJwtTokenStored).toBeFalsy();
  });

  it("should set AppService's flags to true if on following runs", () => {
    appService = new AppService(platform, toast, storageService, authService);

    localStorage.setItem(LOCAL_STORAGE.SIGNATURE, 'true');
    localStorage.setItem(LOCAL_STORAGE.CACHING, 'true');
    localStorage.setItem(LOCAL_STORAGE.EASTER_EGG, 'true');
    localStorage.setItem(APP.INIT_SYNC, 'true');
    localStorage.setItem(LOCAL_STORAGE.JWT_TOKEN, authService.getJWTToken());

    appService.setFlags();

    expect(appService.isSignatureRegistered).toBeTruthy();
    expect(appService.caching).toBeTruthy();
    expect(appService.easterEgg).toBeTruthy();
    expect(appService.isInitSyncDone).toBeTruthy();
    expect(appService.isJwtTokenStored).toBeTruthy();
  });

  it("should manage application initialization", () => {
    appService = new AppService(platform, toast, storageService, authService);

    appService.manageAppInit().then(
      (data) => {
        expect(data).toBeTruthy()
      }
    );
  });

  it("should clear localStorage", () => {
    appService = new AppService(platform, toast, storageService, authService);

    appService.clearLocalStorage().then(
      (data) => expect(data).toBeTruthy()
    )
  });

  it("should set app's easter egg", () => {
    appService = new AppService(platform, toast, storageService, authService);
    appService.setEasterEgg();

    expect(localStorage.getItem(LOCAL_STORAGE.EASTER_EGG)).toBe('true');
    expect(localStorage.getItem(LOCAL_STORAGE.CACHING)).toBe('true');
  });

  it('testing enableCache method: easterEgg = true, caching = true', () => {
    appService = new AppService(platform, toast, storageService, authService);
    appService.count = 0;
    appService.easterEgg = true;
    appService.caching = true;
    appService.enableCache();
    expect(appService.count).toEqual(1);
    expect(appService.caching).toBeTruthy();
    appService.enableCache();
    expect(appService.count).toEqual(2);
    expect(appService.caching).toBeTruthy();
    appService.enableCache();
    expect(appService.count).toEqual(0);
    expect(appService.caching).toBeFalsy();
  });

  it('testing enableCache method: easterEgg = true, caching = false', () => {
    appService = new AppService(platform, toast, storageService, authService);
    appService.count = 0;
    appService.easterEgg = true;
    appService.caching = false;
    appService.enableCache();
    expect(appService.count).toEqual(1);
    expect(appService.caching).toBeFalsy();
    appService.enableCache();
    expect(appService.count).toEqual(2);
    expect(appService.caching).toBeFalsy();
    appService.enableCache();
    expect(appService.count).toEqual(0);
    expect(appService.caching).toBeTruthy();
  });

  it('should test setEasterEgg method with isProduction = true', () => {
    appService = new AppService(platform, toast, storageService, authService);
    appService.setEasterEgg();
    expect(localStorage.setItem).toHaveBeenCalledWith(LOCAL_STORAGE.EASTER_EGG, 'true');
    expect(localStorage.setItem).toHaveBeenCalledWith(LOCAL_STORAGE.CACHING, 'true');
  });

  it('should be false if mobileAccessibility font size is below or equal to iOS default 106%', () => {
    appService = new AppService(platform, toast, storageService, authService);
    
    appService.setAccessibilityTextZoom(106);
    expect(appService.isAccessibilityTextZoomEnabled()).toBeFalsy();

    appService.setAccessibilityTextZoom(90);
    expect(appService.isAccessibilityTextZoomEnabled()).toBeFalsy();
  });

  it('should be true if mobileAccessibility font size is higher than 106%', () => {
    appService = new AppService(platform, toast, storageService, authService);

    appService.setAccessibilityTextZoom(107);
    expect(appService.isAccessibilityTextZoomEnabled()).toBeTruthy();

    appService.setAccessibilityTextZoom(331);
    expect(appService.isAccessibilityTextZoomEnabled()).toBeTruthy();
  });

});
