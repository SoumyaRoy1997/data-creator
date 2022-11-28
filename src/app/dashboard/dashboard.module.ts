import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../common/shared.module';
import { AuthenticationService } from '../service/authentication.service';
import { DashboardComponent } from '../dashboard/dashboard.component'
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AdditionalDetailsComponent } from './additional-details/additional-details.component';
import { VariableFieldsComponent } from './variable-fields/variable-fields.component';
import { ConfirmationWindowComponent } from '../common/confirmation-window/confirmation-window.component';


@NgModule({
    declarations: [
        DashboardComponent,
        AdditionalDetailsComponent,
        VariableFieldsComponent,
        ConfirmationWindowComponent
    ],
    imports: [
      RouterModule,
      SharedModule,
      DashboardRoutingModule
    ],
  exports: [
    DashboardComponent,
    AdditionalDetailsComponent,
    VariableFieldsComponent,
    SharedModule
  ],
  providers: [AuthenticationService],
  entryComponents: [ DashboardComponent]
  })
  export class DashboardModule {}
