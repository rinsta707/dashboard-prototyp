import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ProvisioningOption} from "../../../../../../shared/model/provisioning-option";
import {HclDialogResult, HclModalDialogComponent, HclSelectOption, HclTranslationService} from "@hacon/hcl";
import {ProvisioningRestrictionsComponent} from "../../provisioning-restrictions/provisioning-restrictions.component";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../users/shared/modal-options";
import {LoggedUserService} from "../../../../../../shared/services/logged-user.service";

@Component({
  selector: 'app-provisioning-options-edit-modal',
  templateUrl: './provisioning-options-edit-modal.component.html',
  styleUrl: './provisioning-options-edit-modal.component.scss'
})
export class ProvisioningOptionsEditModalComponent {

  @Output() saveEvent = new EventEmitter<ProvisioningOption>();

  @ViewChild('editOptionModal')
  private editOptionModal!: HclModalDialogComponent;

  @ViewChild('editProvisioningRestrictionsTab')
  private editProvisioningRestrictionsTab!: ProvisioningRestrictionsComponent;

  private provisioningTypes = ['TEXT', 'BOOLEAN', 'SELECT_ENUM_SINGLE', 'SELECT_ENUM_MULTI'];
  protected form: FormGroup;
  protected option: ProvisioningOption | undefined;
  protected selectTypeOptions: HclSelectOption<string>[] = [
    { modelValue: '', viewValue: '' }
  ]

  constructor(private fb: FormBuilder, private translate: HclTranslationService, private loggedUserService: LoggedUserService) {
    this.initTypeOptions();
    this.form = this.fb.group({
      id: [null, Validators.required],
      type: [{ value: '', disabled: true },  Validators.required],
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

  public open(option: ProvisioningOption): Observable<HclDialogResult> {
    this.form.reset();
    this.names.clear();
    this.descriptions.clear();
    this.option = option;

    option.names.forEach(translation => {
      this.names.push(this.createNameFormGroup(translation));
    });

    option.descriptions.forEach(translation => {
      this.descriptions.push(this.createDescriptionFormGroup(translation));
    });

    option.restrictions.forEach(restriction => {
      restriction.translations.forEach(translation => {
        if (translation.locale === this.loggedUserService.getLocale()) {
          restriction.translation = translation.description;
        }
      });
    });

    this.form.patchValue(option);
    this.form.controls['type'].disable();

    return this.editOptionModal.open(userModalOptions);
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
      id: [translation.id || ''],
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
      id: [translation.id || ''],
      locale: [translation.locale || '', Validators.required],
      description: [translation.description || '', Validators.required],
      type: ['SERVICE_OPTION_SELECT']
    });
  }

  onSave() {
    if (this.form.valid) {
      this.form.controls['type'].enable();
      this.getRestrictions();
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  private getRestrictions() {
    if (this.form.controls['type'].value === 'SELECT_ENUM_SINGLE' || this.form.controls['type'].value === 'SELECT_ENUM_MULTI') {
      this.form.controls['restrictions'].setValue(this.editProvisioningRestrictionsTab.getRestrictions());
    }
  }

  public close() {
    this.editOptionModal.cancel();
  }

}
