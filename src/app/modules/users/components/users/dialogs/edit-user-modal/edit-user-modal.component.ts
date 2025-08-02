import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HclDialogResult, HclModalDialogComponent } from '@hacon/hcl';
import { Observable } from 'rxjs';
import {User} from "../../../../../../shared/model/user";
import {userModalOptions} from "../../../../shared/modal-options";
import {UserRoleCheck} from "../../../../../../shared/services/user-role-check.service";
import {mustMatch, rolesValidator} from 'src/app/shared/functions/password-validator';
@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.scss'
})
export class EditUserModalComponent {

  @Output() saveEvent = new EventEmitter<User>();

  @ViewChild('editUserModal')
  private editUserModal!: HclModalDialogComponent;

  protected isSystemAdmin;

  protected form: FormGroup;

  constructor(private fb: FormBuilder, private roleCheckService: UserRoleCheck) {
    this.isSystemAdmin = roleCheckService.isSystemAdmin();

    this.form = this.fb.group({
      username: [''],
      roles: [['']],
      id:[''],
      isSystemAdmin: [{value: false, disabled: !this.isSystemAdmin}],
      isAdmin: [false],
      isUser: [false],
      isGuest: [false],
      locale: [''],
      paginatorDefault: [0],
      notifications: [false],
      password: ['', Validators.minLength(8)],
      repeatPassword: ['', Validators.minLength(8)]
    }, {
      validators: [mustMatch('password', 'repeatPassword'), rolesValidator]
    })
  }

  public open(user:User): Observable<HclDialogResult> {
    this.form.reset();

    this.form.controls['isSystemAdmin'].setValue(user.roles.includes('ROLE_SYSTEM_ADMIN'));
    this.form.controls['isAdmin'].setValue(user.roles.includes('ROLE_ADMIN'));
    this.form.controls['isUser'].setValue(user.roles.includes('ROLE_USER'));
    this.form.controls['isGuest'].setValue(user.roles.includes('ROLE_VIEWER'));

    this.form.patchValue(user);
    return this.editUserModal.open(userModalOptions);
  }
  public close() {
    this.editUserModal.cancel();
  }

  save(){
    if (this.form.valid) {
      this.checkRoles();
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAsTouched();
    }
  }

  private checkRoles() {
    let roles = [];
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
