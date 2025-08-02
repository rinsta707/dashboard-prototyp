import { Component, ViewChild } from '@angular/core';
import { HclModalDialogComponent, HclDialogResult } from '@hacon/hcl';
import { Observable } from 'rxjs';
import { userModalOptions } from 'src/app/modules/users/shared/modal-options';
import { MessagesReceiver } from 'src/app/shared/model/MessagesReceiver';

@Component({
  selector: 'app-delete-email-modal',
  templateUrl: './delete-email-modal.component.html',
  styleUrl: './delete-email-modal.component.scss'
})
export class DeleteEmailModalComponent {

  @ViewChild('deleteEmailModal')
  private deleteEmailModal!: HclModalDialogComponent;

  protected mail: string = '';
  protected loggedUser = false;

  public open(messagesReceiver: MessagesReceiver): Observable<HclDialogResult> {
    this.mail = messagesReceiver.email;
    return this.deleteEmailModal.open(userModalOptions);
  }

}
