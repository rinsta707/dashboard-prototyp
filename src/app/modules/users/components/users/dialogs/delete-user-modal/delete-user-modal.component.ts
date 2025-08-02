import {Component, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {Observable} from "rxjs";
import {User} from "../../../../../../shared/model/user";
import {userModalOptions} from "../../../../shared/modal-options";

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrl: './delete-user-modal.component.scss'
})
export class DeleteUserModalComponent {

  @ViewChild('deleteUserModal')
  private deleteUserModal!: HclModalDialogComponent;

  protected userName: string = '';
  protected loggedUser = false;

  public open(user: User, loggedUser = false): Observable<HclDialogResult> {
    this.userName = user.username;
    this.loggedUser = loggedUser;
    return this.deleteUserModal.open(userModalOptions);
  }

}
