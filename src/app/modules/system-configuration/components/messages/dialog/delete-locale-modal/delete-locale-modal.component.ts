import { Component, ViewChild } from '@angular/core';
import { HclModalDialogComponent, HclDialogResult } from '@hacon/hcl';
import { Observable } from 'rxjs';
import { userModalOptions } from 'src/app/modules/users/shared/modal-options';
import { MessagesTemplate } from 'src/app/shared/model/messages-template';

@Component({
  selector: 'app-delete-locale-modal',
  templateUrl: './delete-locale-modal.component.html',
  styleUrl: './delete-locale-modal.component.scss'
})
export class DeleteLocaleModalComponent {

  @ViewChild('deleteTemplateModal')
  private deleteTemplateModal!: HclModalDialogComponent;

  protected template: string = '';
  protected loggedUser = false;

  public open(MessagesTemplate: MessagesTemplate): Observable<HclDialogResult> {
    this.template = MessagesTemplate.locale;
    return this.deleteTemplateModal.open(userModalOptions);
  }

}