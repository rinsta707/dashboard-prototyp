import {Component, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent, HclSelectOption, HclTranslationService} from "@hacon/hcl";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../users/shared/modal-options";
import {ProvisioningOption} from "../../../../../../shared/model/provisioning-option";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {LoggedUserService} from "../../../../../../shared/services/logged-user.service";

@Component({
  selector: 'app-provisioning-options-view-modal',
  templateUrl: './provisioning-options-view-modal.component.html',
  styleUrl: './provisioning-options-view-modal.component.scss'
})
export class ProvisioningOptionsViewModalComponent {

  @ViewChild('viewOptionModal')
  private viewOptionModal!: HclModalDialogComponent;

  private provisioningTypes = ['TEXT', 'BOOLEAN', 'SELECT_ENUM_SINGLE', 'SELECT_ENUM_MULTI'];
  protected showValuesTab = false;
  protected form: FormGroup;
  protected provisioningOption!: ProvisioningOption
  protected selectTypeOptions: HclSelectOption<string>[] = [
    { modelValue: '', viewValue: '' }
  ]

  constructor(private fb: FormBuilder, private translate: HclTranslationService, private loggedUserService: LoggedUserService) {
    this.initTypeOptions();
    this.form = this.fb.group({
      id: [''],
      type: [''],
      key: [''],
      names: this.fb.array([]),
      descriptions: this.fb.array([])
    })
  }

  public open(option: ProvisioningOption): Observable<HclDialogResult> {
    this.form.reset();
    this.names.clear();
    this.descriptions.clear();

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
    this.form.disable();
    this.provisioningOption = option;
    this.showValuesTab = option.type === 'SELECT_ENUM_SINGLE' || option.type === 'SELECT_ENUM_MULTI';

    return this.viewOptionModal.open(userModalOptions);
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

  private createNameFormGroup(translation: any = {}): FormGroup {
    return this.fb.group({
      locale: [translation.locale || ''],
      description: [translation.description || '']
    });
  }

  get descriptions(): FormArray {
    return this.form.get('descriptions') as FormArray;
  }

  private createDescriptionFormGroup(translation: any = {}): FormGroup {
    return this.fb.group({
      locale: [translation.locale || ''],
      description: [translation.description || '']
    });
  }

}
