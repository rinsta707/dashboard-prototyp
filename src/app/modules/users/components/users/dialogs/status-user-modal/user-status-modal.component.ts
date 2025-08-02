import { Component, ViewChild } from '@angular/core';
import { HclModalDialogComponent, HclDialogResult } from '@hacon/hcl';
import { Observable } from 'rxjs';
import { userModalOptions } from 'src/app/modules/users/shared/modal-options';
import { User } from 'src/app/shared/model/user';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './user-status-modal.component.html',
  styleUrl: './user-status-modal.component.scss'
})
export class UserStatusModalComponent {

  @ViewChild('statusModal')
  private statusModal!: HclModalDialogComponent;

  protected user: User | undefined;

  constructor(){}

  public open(user:User): Observable<HclDialogResult> {
    this.user = user;
    return this.statusModal.open(userModalOptions);
  }

}


