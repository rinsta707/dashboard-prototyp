import { Component, ViewChild } from '@angular/core';
import { MessagesReceiver } from 'src/app/shared/model/messages-Receiver';
import { catchError, of } from "rxjs";
import { MessageService } from 'src/app/shared/services/message.service';
import { AddEmailModalComponent } from '../../dialog/add-email-modal/add-email-modal.component';
import { DeleteEmailModalComponent } from '../../dialog/delete-email-modal/delete-email-modal.component';
import { UpdateEmailModalComponent } from '../../dialog/update-email-modal/update-email-modal.component';
import { ReceiverService } from 'src/app/modules/system-configuration/services/messages/receiver.service';

@Component({
  selector: 'app-email-receivers',
  templateUrl: './email-receivers.component.html',
  styleUrls: ['./email-receivers.component.scss']
})
export class EmailReceiversComponent {
  @ViewChild('addEmail') addEmailModal!: AddEmailModalComponent;
  @ViewChild('deleteEmail') deleteEmailModal!: DeleteEmailModalComponent;
  @ViewChild('updateEmail') updateEmailModal!: UpdateEmailModalComponent;

  data: MessagesReceiver[] = [];
  displayedColumns: string[] = ['email', 'actions'];

  constructor(private receiverService: ReceiverService, private messageService: MessageService) {}
  
  public assertDataType(data: any): any {
    return data;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.receiverService.getMessagesReceivers().subscribe(data => {
      this.data = data;
    });
  }

  onAddMessagesReceiver(): void {
    this.addEmailModal.open();
  }

  onDeleteMessagesReceiver(element: MessagesReceiver): void {
    this.deleteEmailModal.open(element).subscribe(result => {
      if (result.data == true) {
        this.receiverService.deleteMessagesReceiver(element.id).pipe(
          catchError(error => {
            this.messageService.showErrorWithCode('messages.tabs.messages-receiver.modals.delete.error', error);
            return of(error);
          })
        ).subscribe(result => {
          if (result.status === 200) {
            this.loadData();
            this.messageService.showSuccessMessage('messages.tabs.messages-receiver.modals.delete.success');
          }
        });
      }
    });
  }

  onUpdateMessagesReceiver(element: MessagesReceiver): void {
    this.updateEmailModal.open(element);
  }

  saveMessagesReceiver(email: MessagesReceiver): void {
    this.receiverService.addMessagesReceiver(email).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 201) {
        this.addEmailModal.close();
        this.loadData();
        this.messageService.showSuccessMessage('messages.tabs.messages-receiver.modals.add.success');
      } else if (result.status === 409) {
        this.messageService.showError('messages.tabs.messages-receiver.modals.add.email-exists');
      } else {
        this.messageService.showError('messages.tabs.messages-receiver.modals.add.error');
      }
    });
  }

  updateMessagesReceiver(email: MessagesReceiver): void {
    this.receiverService.updateMessageReceiver(email).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 200) {
        this.updateEmailModal.close();
        this.loadData();
        this.messageService.showSuccessMessage('messages.tabs.messages-receiver.modals.update.success');
      } else if (result.status === 409) {
        this.messageService.showError('messages.tabs.messages-receiver.modals.update.email-exists');
      } else {
        this.messageService.showError('messages.tabs.messages-receiver.modals.update.error');
      }
    });
  }
}
