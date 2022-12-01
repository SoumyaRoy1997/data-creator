import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../common/shared.module';
import { AuthenticationService } from '../service/authentication.service';
import { DashboardComponent } from '../dashboard/dashboard.component'
import { DashboardRoutingModule } from './dashboard-routing.module';
import { VariableFieldsComponent } from './variable-fields/variable-fields.component';
import { ConfirmationWindowComponent } from '../common/confirmation-window/confirmation-window.component';
import { ProgressSpinnerComponent } from '../common/progress-spinner/progress-spinner.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { InstructionFormComponent } from './instruction-form/instruction-form.component';


@NgModule({
    declarations: [
        DashboardComponent,
        VariableFieldsComponent,
        ConfirmationWindowComponent,
        ProgressSpinnerComponent,
        UserDashboardComponent,
        InstructionFormComponent
    ],
    imports: [
      RouterModule,
      SharedModule,
      DashboardRoutingModule
    ],
  exports: [
    DashboardComponent,
    VariableFieldsComponent,
    SharedModule
  ],
  providers: [AuthenticationService],
  entryComponents: [ DashboardComponent]
  })
  export class DashboardModule {}
