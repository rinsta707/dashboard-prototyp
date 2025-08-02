import {Component, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../users/shared/modal-options";
import {Service} from "../../../../../../shared/model/service";

@Component({
  selector: 'app-available-services-view-modal',
  templateUrl: './available-services-view-modal.component.html',
  styleUrl: './available-services-view-modal.component.scss'
})
export class AvailableServicesViewModalComponent {

  @ViewChild('viewServiceModal')
  private viewServiceModal!: HclModalDialogComponent;

  protected form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      key: [''],
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

  public open(service: Service): Observable<HclDialogResult> {
    this.form.reset();
    this.translations.clear();

    service.translations.forEach(translation => {
      this.translations.push(this.createTranslationFormGroup(translation));
    });

    this.form.patchValue({ key: service.key});
    this.form.disable();
    return this.viewServiceModal.open(userModalOptions);
  }

}
