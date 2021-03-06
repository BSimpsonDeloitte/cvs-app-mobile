import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitTimelinePage } from "./visit-timeline";
import { TestService } from "../../../providers/test/test.service";
import { PipesModule } from "../../../pipes/pipes.module";
import { FormatVrmPipe } from '../../../pipes/format-vrm/format-vrm.pipe';

@NgModule({
  declarations: [
    VisitTimelinePage,
  ],
  imports: [
    IonicPageModule.forChild(VisitTimelinePage),
    PipesModule
  ],
  providers: [
    TestService,
    FormatVrmPipe
  ]
})
export class VisitTimelineModule {
}
