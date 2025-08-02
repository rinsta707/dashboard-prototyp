import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Service} from "../../../../../../shared/model/service";
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../users/shared/modal-options";

@Component({
  selector: 'app-available-services-edit-modal',
  templateUrl: './available-services-edit-modal.component.html',
  styleUrl: './available-services-edit-modal.component.scss'
})
export class AvailableServicesEditModalComponent {

  @Output() saveEvent = new EventEmitter<Service>();

  @ViewChild('editServiceModal')
  private editServiceModal!: HclModalDialogComponent;

  protected form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: ['', Validators.required],
      key: ['', Validators.required],
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
      type: ['SERVICE']
    });
  }


  private translationsValidator(control: AbstractControl): { [key: string]: boolean } | null {
    let translations = control.value;
    let hasDe = translations.some((t: any) => t.locale === 'de');
    let hasEn = translations.some((t: any) => t.locale === 'en');
    return hasDe && hasEn ? null : { missingRequiredTranslations: true };
  }

  public open(service: Service): Observable<HclDialogResult> {
    this.form.reset();
    this.translations.clear();

    service.translations.forEach(translation => {
      this.translations.push(this.createTranslationFormGroup(translation));
    });
    this.form.patchValue(service);

    return this.editServiceModal.open(userModalOptions);

  }

  public close() {
    this.editServiceModal.cancel();
  }

  onSave() {
    if (this.form.valid) {
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

}
