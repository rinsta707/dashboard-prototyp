import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../../users/shared/modal-options";
import {Translation} from "../../../../../../../shared/model/translation";
import {ProvisioningOptionRestriction} from "../../../../../../../shared/model/provisioning-option-restriction";

@Component({
  selector: 'app-provisioning-restriction-add-modal',
  templateUrl: './provisioning-restriction-add-modal.component.html',
  styleUrl: './provisioning-restriction-add-modal.component.scss'
})
export class ProvisioningRestrictionAddModalComponent {

  @Output() saveEvent = new EventEmitter<ProvisioningOptionRestriction>();

  @ViewChild('addRestrictionModal')
  private addRestrictionModal!: HclModalDialogComponent;

  protected form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
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

  public open(): Observable<HclDialogResult> {
    this.form.reset();
    this.translations.clear();

    let translationEn = this.getTranslation('en');
    let translationDe = this.getTranslation('de');
    this.translations.push(this.createTranslationFormGroup(translationEn));
    this.translations.push(this.createTranslationFormGroup(translationDe));

    return this.addRestrictionModal.open(userModalOptions);
  }

  public close() {
    this.addRestrictionModal.cancel();
  }

  onSave() {
    if (this.form.valid) {
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  getTranslation(locale: string): Translation {
    return {
      id: null,
      locale: locale,
      description: '',
      type: 'SERVICE_OPTION_SELECT'
    }
  }

}
