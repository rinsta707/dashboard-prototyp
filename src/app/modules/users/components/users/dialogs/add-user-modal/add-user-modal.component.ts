import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {FormBuilder, FormGroup, Validators, AbstractControl} from "@angular/forms";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../shared/modal-options";
import {User} from "../../../../../../shared/model/user";
import {UserRoleCheck} from "../../../../../../shared/services/user-role-check.service";
import {mustMatch, rolesValidator} from 'src/app/shared/functions/password-validator';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss'
})
export class AddUserModalComponent {

  @Output() saveEvent = new EventEmitter<User>();

  @ViewChild('addUserModal')
  private addUserModal!: HclModalDialogComponent;

  protected isSystemAdmin;

  protected form: FormGroup;

  constructor(private fb: FormBuilder, roleCheckService: UserRoleCheck) {
    this.isSystemAdmin = roleCheckService.isSystemAdmin();

    this.form = this.fb.group({
      username: ['', Validators.required],
      roles: [['']],
      isSystemAdmin: [{value: false, disabled: !this.isSystemAdmin}],
      isAdmin: [false],
      isUser: [false],
      isGuest: [false],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: [mustMatch('password', 'repeatPassword'), rolesValidator]
    })
  }

  public open(): Observable<HclDialogResult> {
    this.form.reset();
    return this.addUserModal.open(userModalOptions);
  }

  public close() {
    this.addUserModal.cancel();
  }

  public onSave() {
    if (this.form.valid) {
      this.checkRoles();
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  private checkRoles() {
    let roles = [];
    if (this.form.controls['isSystemAdmin'].value) {
      roles.push('ROLE_SYSTEM_ADMIN');
    }
    if (this.form.controls['isAdmin'].value) {
      roles.push('ROLE_ADMIN');
    }
    if (this.form.controls['isUser'].value) {
      roles.push('ROLE_USER');
    }
    if (this.form.controls['isGuest'].value) {
      roles.push('ROLE_VIEWER');
    }
    this.form.controls['roles'].setValue(roles);
  }

}
