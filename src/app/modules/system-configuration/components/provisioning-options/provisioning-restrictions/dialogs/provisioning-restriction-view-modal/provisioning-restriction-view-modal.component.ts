import {Component, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../../users/shared/modal-options";
import {ProvisioningOptionRestriction} from "../../../../../../../shared/model/provisioning-option-restriction";

@Component({
  selector: 'app-provisioning-restriction-view-modal',
  templateUrl: './provisioning-restriction-view-modal.component.html',
  styleUrl: './provisioning-restriction-view-modal.component.scss'
})
export class ProvisioningRestrictionViewModalComponent {

  @ViewChild('viewRestrictionModal')
  private viewRestrictionModal!: HclModalDialogComponent;

  protected form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      value: [''],
      translations: this.fb.array([])
    })
  }

  get translations(): FormArray {
    return this.form.get('translations') as FormArray;
  }

  private createTranslationFormGroup(translation: any = {}): FormGroup {
    return this.fb.group({
      locale: [translation.locale || ''],
      description: [translation.description || '']
    });
  }

  public open(option: ProvisioningOptionRestriction): Observable<HclDialogResult> {
    this.form.reset();
    this.translations.clear();

    option.translations.forEach(translation => {
      this.translations.push(this.createTranslationFormGroup(translation));
    });

    this.form.patchValue({ value: option.value });
    this.form.disable();
    return this.viewRestrictionModal.open(userModalOptions);
  }


}
