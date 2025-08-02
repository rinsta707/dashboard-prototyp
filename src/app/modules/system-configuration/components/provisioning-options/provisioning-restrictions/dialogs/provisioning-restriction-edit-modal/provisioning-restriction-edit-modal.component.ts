import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../../users/shared/modal-options";
import {ProvisioningOptionRestriction} from "../../../../../../../shared/model/provisioning-option-restriction";

@Component({
  selector: 'app-provisioning-restriction-edit-modal',
  templateUrl: './provisioning-restriction-edit-modal.component.html',
  styleUrl: './provisioning-restriction-edit-modal.component.scss'
})
export class ProvisioningRestrictionEditModalComponent {

  @Output() saveEvent = new EventEmitter<ProvisioningOptionRestriction>();

  @ViewChild('editRestrictionModal')
  private editRestrictionModal!: HclModalDialogComponent;

  protected form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      value: ['', Validators.required],
      translations: this.fb.array([], this.translationsValidator)
    })
  }

  get translations(): FormArray {
    return this.form.get('translations') as FormArray;
  }

  addTranslation() {
    this.translations.push(this.createTranslationFormGroup());
  }

  removeTranslation(index: number) {
    this.translations.removeAt(index);
  }

  private createTranslationFormGroup(translation: any = {}): FormGroup {
    return this.fb.group({
      id: [translation.id || null],
      locale: [translation.locale || '', Validators.required],
      description: [translation.description || '', Validators.required],
      type: ['SERVICE_OPTION_SELECT']
    });
  }


  private translationsValidator(control: AbstractControl): { [key: string]: boolean } | null {
    let translations = control.value;
    let hasDe = translations.some((t: any) => t.locale === 'de');
    let hasEn = translations.some((t: any) => t.locale === 'en');
    return hasDe && hasEn ? null : { missingRequiredTranslations: true };
  }

  public open(restriction: ProvisioningOptionRestriction): Observable<HclDialogResult> {
    this.form.reset();
    this.translations.clear();

    if (!restriction.id) {
      this.form.controls['value'].disable()
    }

    restriction.translations.forEach(translation => {
      this.translations.push(this.createTranslationFormGroup(translation));
    });
    this.form.patchValue(restriction);

    return this.editRestrictionModal.open(userModalOptions);
  }

  public close() {
    this.editRestrictionModal.cancel();
  }

  onSave() {
    if (this.form.valid) {
      this.form.controls['value'].enable();
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

}
