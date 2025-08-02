import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HclDialogResult, HclModalDialogComponent } from '@hacon/hcl';
import { Observable } from 'rxjs';
import { userModalOptions } from 'src/app/modules/users/shared/modal-options';
import { mustMatch } from 'src/app/shared/functions/password-validator';
import { User } from 'src/app/shared/model/user';


@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss'
})
export class ChangePasswordModalComponent {
  @ViewChild('changePasswordModal')
  private changePasswordModal!: HclModalDialogComponent;
  @Output() saveEvent = new EventEmitter<User>();
  protected form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      password: ['', Validators.minLength(8)],
      repeatPassword: ['', Validators.minLength(8)]
    }, {
      validators: mustMatch('password', 'repeatPassword')
    })
  }

  public close() {
    this.changePasswordModal.cancel();
  }
  save(){
    if (this.form.valid) {
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAsTouched();
    }
  }
  public open(): Observable<HclDialogResult> {
    this.form.reset();
    return this.changePasswordModal.open(userModalOptions);
  }
  
}


