import { Injectable } from "@angular/core";
import { TestModel } from "../../models/tests/test.model";
import { VisitModel } from "../../models/visit/visit.model";
import { StorageService } from "../natives/storage.service";

@Injectable()
export class VisitService {
  visit: VisitModel;

  constructor(public storageService: StorageService) {
    this.visit = {} as VisitModel
  }

  createVisit(atf) {
    this.visit.startTime = new Date().toISOString();
    this.visit.endTime = null;
    this.visit.testStationName = atf.atfName;
    this.visit.testStationNumber = atf.atfNumber;
    this.visit.testStationType = atf.atfType;
    this.visit.testerId = '';
    this.visit.testerName = '';
    this.visit.tests = [];
    this.updateVisit();
    return this.visit;
  }

  endVisit() {
    this.visit.endTime = new Date().toISOString();
    this.updateVisit();
  }

  addTest(test: TestModel) {
    this.visit.tests.push(test);
    this.updateVisit();
  }

  removeTest(testToRemove: TestModel) {
    this.visit.tests.forEach((testReport, index) => {
      if (testReport == testToRemove) {
        this.visit.tests.splice(index, 1);
      }
    });
    this.updateVisit();
  }

  getTests(): TestModel[] {
    return this.visit.tests;
  }

  updateVisit() {
    this.storageService.update('visit', this.visit);
  }

}