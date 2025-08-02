import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent, HclSelectOption, HclTranslationService} from "@hacon/hcl";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProvisioningOption} from "../../../../../../shared/model/provisioning-option";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../users/shared/modal-options";
import {Translation} from "../../../../../../shared/model/translation";
import {ProvisioningRestrictionsComponent} from "../../provisioning-restrictions/provisioning-restrictions.component";

@Component({
  selector: 'app-provisioning-options-add-custom-modal',
  templateUrl: './provisioning-options-add-custom-modal.component.html',
  styleUrl: './provisioning-options-add-custom-modal.component.scss'
})
export class ProvisioningOptionsAddCustomModalComponent {

  @Output() saveEvent = new EventEmitter<ProvisioningOption>();

  @ViewChild('addOptionModal')
  private addOptionModal!: HclModalDialogComponent;

  @ViewChild('addProvisioningRestrictionsTab')
  private addProvisioningRestrictionsTab!: ProvisioningRestrictionsComponent;

  private provisioningTypes = ['TEXT', 'BOOLEAN', 'SELECT_ENUM_SINGLE', 'SELECT_ENUM_MULTI'];
  protected form: FormGroup;
  protected selectTypeOptions: HclSelectOption<string>[] = [
    { modelValue: '', viewValue: '' }
  ]

  constructor(private fb: FormBuilder, private translate: HclTranslationService) {
    this.initTypeOptions();
    this.form = this.fb.group({
      type: ['', Validators.required],
      key: ['', Validators.required],
      names: this.fb.array([], this.translationsValidator),
      descriptions: this.fb.array([], this.translationsValidator),
      restrictions: [[]]
    })
  }

  private translationsValidator(control: AbstractControl): { [key: string]: boolean } | null {
    let translations = control.value;
    let hasDe = translations.some((t: any) => t.locale === 'de');
    let hasEn = translations.some((t: any) => t.locale === 'en');
    return hasDe && hasEn ? null : { missingRequiredTranslations: true };
  }

  public open(): Observable<HclDialogResult> {
    this.form.reset();
    this.names.clear();
    this.descriptions.clear();

    let translationNameEn = this.getTranslation('en');
    let translationNameDe = this.getTranslation('de');
    let translationDescriptionEn = this.getTranslation('en');
    let translationDescriptionDe = this.getTranslation('de');

    this.names.push(this.createNameFormGroup(translationNameEn));
    this.names.push(this.createNameFormGroup(translationNameDe));
    this.descriptions.push(this.createDescriptionFormGroup(translationDescriptionEn));
    this.descriptions.push(this.createDescriptionFormGroup(translationDescriptionDe));

    return this.addOptionModal.open(userModalOptions);
  }

  private initTypeOptions() {
    this.selectTypeOptions = [];
    this.provisioningTypes.forEach(type => {
      this.selectTypeOptions.push(
        {
          modelValue: type,
          viewValue: this.translate.instant('provisioning-options.types.' + type)
        });
    })
  }

  get names(): FormArray {
    return this.form.get('names') as FormArray;
  }

  addName() {
    this.names.push(this.createNameFormGroup());
  }

  removeName(index: number) {
    this.names.removeAt(index);
  }

  private createNameFormGroup(translation: any = {}): FormGroup {
    return this.fb.group({
      locale: [translation.locale || '', Validators.required],
      description: [translation.description || '', Validators.required],
      type: ['SERVICE_OPTION_SELECT']
    });
  }

  get descriptions(): FormArray {
    return this.form.get('descriptions') as FormArray;
  }

  addDescription() {
    this.descriptions.push(this.createDescriptionFormGroup());
  }

  removeDescription(index: number) {
    this.descriptions.removeAt(index);
  }

  private createDescriptionFormGroup(translation: any = {}): FormGroup {
    return this.fb.group({
      locale: [translation.locale || '', Validators.required],
      description: [translation.description || '', Validators.required],
      type: ['SERVICE_OPTION_SELECT']
    });
  }

  onSave() {
    if (this.form.valid) {
      this.getRestrictions();
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

  private getRestrictions() {
    if (this.form.controls['type'].value === 'SELECT_ENUM_SINGLE' || this.form.controls['type'].value === 'SELECT_ENUM_MULTI') {
      this.form.controls['restrictions'].setValue(this.addProvisioningRestrictionsTab.getRestrictions());
    }
  }

  public close() {
    this.addOptionModal.cancel();
  }
}
