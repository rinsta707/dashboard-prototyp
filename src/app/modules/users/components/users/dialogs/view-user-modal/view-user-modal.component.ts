import {Component, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {User} from "../../../../../../shared/model/user";
import {userModalOptions} from "../../../../shared/modal-options";

@Component({
  selector: 'app-user-view-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrl: './view-user-modal.component.scss'
})
export class ViewUserModalComponent {

  @ViewChild('viewUserModal')
  private viewUserModal!: HclModalDialogComponent;

  protected form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: [''],
      roles: [['']],
      isSystemAdmin: [false],
      isAdmin: [false],
      isUser: [false],
      isGuest: [false],
      password: [''],
      repeatPassword: ['']
    })
  }

  public open(user: User): Observable<HclDialogResult> {
    this.form.reset();

    this.form.controls['isSystemAdmin'].setValue(user.roles.includes('ROLE_SYSTEM_ADMIN'));
    this.form.controls['isAdmin'].setValue(user.roles.includes('ROLE_ADMIN'));
    this.form.controls['isUser'].setValue(user.roles.includes('ROLE_USER'));
    this.form.controls['isGuest'].setValue(user.roles.includes('ROLE_VIEWER'));

    this.form.patchValue(user);
    this.form.disable();
    return this.viewUserModal.open(userModalOptions);
  }

}
