import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HclModalDialogComponent, HclDialogResult } from '@hacon/hcl';
import { Observable } from 'rxjs';
import { userModalOptions } from 'src/app/modules/users/shared/modal-options';
import { MessagesReceiver } from 'src/app/shared/model/MessagesReceiver';

@Component({
  selector: 'app-update-email-modal',
  templateUrl: './update-email-modal.component.html',
  styleUrl: './update-email-modal.component.scss'
})
export class UpdateEmailModalComponent {

  @Output() saveEvent = new EventEmitter<MessagesReceiver>();

  @ViewChild('updateEmailModal')
  private updateEmailModal!: HclModalDialogComponent;

  protected form: FormGroup;

  constructor(private fb: FormBuilder) {
    
    this.form = this.fb.group({
      email: [''],
      id: []
    })
  }

  public open(email:MessagesReceiver): Observable<HclDialogResult> {
    this.form.reset();


    this.form.patchValue(email);
    return this.updateEmailModal.open(userModalOptions);
  }
  public close() {
    this.updateEmailModal.cancel();
  }

  save(){
    if (this.form.valid) {
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAsTouched();
    }
  }
}
