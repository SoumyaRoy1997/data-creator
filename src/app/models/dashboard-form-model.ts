import { FormControl, FormGroup, Validators } from '@angular/forms';
import { variableFields } from './variable-fields';

export class dashboadFormModel {

  static asFormGroup(variableFieldForm: variableFields): FormGroup {
    const fg = new FormGroup({
        columnType: new FormControl(variableFieldForm.columnType, Validators.required),
        columnName: new FormControl(variableFieldForm.columnName, Validators.required),
        columnLength: new FormControl(variableFieldForm.columnLength, Validators.required),
        columnIndex: new FormControl(variableFieldForm.columnIndex, Validators.required),
        domain: new FormControl(variableFieldForm.domain, Validators.required),
        sampleData: new FormControl(variableFieldForm.sampleData, Validators.required),
        dateFormat: new FormControl(variableFieldForm.dateFormat, Validators.required),
        startDate: new FormControl(variableFieldForm.startDate, Validators.required),
        checkFlag: new FormControl(false, Validators.required),
        // columnLength: new FormControl(variableFieldForm.columnLength, Validators.required),
    });
    return fg;
  }
}
