import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HclDialogResult, HclModalDialogComponent } from '@hacon/hcl';
import { Observable } from 'rxjs';
import { userModalOptions } from 'src/app/modules/users/shared/modal-options';
import { MessagesReceiver } from 'src/app/shared/model/MessagesReceiver';

@Component({
  selector: 'app-add-email-modal',
  templateUrl: './add-email-modal.component.html',
  styleUrl: './add-email-modal.component.scss'
})
export class AddEmailModalComponent {

  @Output() saveEvent = new EventEmitter<MessagesReceiver>(); 

  @ViewChild('addEmailModal')
  private addEmailModal!: HclModalDialogComponent;

  protected form: FormGroup;

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      email: ['', Validators.required],
      id: []
    })
  }

  public open(): Observable<HclDialogResult> {
    this.form.reset();
    return this.addEmailModal.open(userModalOptions);
  }

  public close() {
    this.addEmailModal.cancel();
  }

  public onSave() {
    if (this.form.valid) {
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
