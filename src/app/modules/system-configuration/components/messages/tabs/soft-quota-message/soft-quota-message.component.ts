import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'src/app/shared/services/message.service';
import { AddLocaleModalComponent } from '../../dialog/add-locale-modal/add-locale-modal.component';
import { MessagesTemplate } from 'src/app/shared/model/messages-template';
import { catchError, of } from 'rxjs';
import { DeleteLocaleModalComponent } from '../../dialog/delete-locale-modal/delete-locale-modal.component';
import { TemplateService } from 'src/app/modules/system-configuration/services/messages/template.service';

@Component({
  selector: 'app-soft-quota-message',
  templateUrl: './soft-quota-message.component.html',
  styleUrls: ['./soft-quota-message.component.scss']
})
export class SoftQuotaMessageComponent implements OnInit, AfterViewInit {
  @ViewChild('addLocale') addLocaleModal!: AddLocaleModalComponent;
  @ViewChild('deleteTemplate') deleteTemplateModal!: DeleteLocaleModalComponent;

  templateData: { locale: string, template: string, id: number, quotaType: string }[] = [];

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }]
    ]
  };

  constructor(
    private messageService: MessageService,
    private templateService: TemplateService 
  ) {}

  ngAfterViewInit(): void {
    this.loadSoftQuota();
  }

  ngOnInit() {
    this.loadSoftQuota();
  }

  loadSoftQuota(): void {
    this.templateService.getSoftQuotaTemplate().subscribe((template: MessagesTemplate[]) => {
      this.templateData = template.map(t => ({
        locale: t.locale,
        template: t.template,
        id: t.id,
        quotaType: t.quotaType
      }));
    });
  }

  onAddMessagesTemplate(): void {
    this.addLocaleModal.open();
  }

  updateMessagesTemplate(template: MessagesTemplate): void {
    this.templateService.updateMessageTemplate(template).pipe( 
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 200) {
        this.loadSoftQuota();
        this.messageService.showSuccessMessage('messages.tabs.quota.modals.update.success');
      } else if (result.status === 409) {
        this.messageService.showError('messages.tabs.quota.modals.update.error');
      } else {
        this.messageService.showError('messages.tabs.quota.modals.update.error');
      }
    });
  }

  saveMessagesTemplate(template: MessagesTemplate): void {
    template.quotaType = 'soft';
    this.templateService.addMessagesTemplate(template).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 201) {
        this.addLocaleModal.close();
        this.loadSoftQuota();
        this.messageService.showSuccessMessage('messages.tabs.quota.modals.add.success');
      } else if (result.status === 409) {
        this.messageService.showError('messages.tabs.quota.modals.add.locale-exists');
      } else {
        this.messageService.showError('messages.tabs.quota.modals.add.error');
      }
    });
  }

  deleteMessagesTemplate(element: MessagesTemplate): void {
    this.deleteTemplateModal.open(element).subscribe(result => {
      if (result.data === true) {
        this.templateService.deleteMessagesTemplate(element.id).pipe(
          catchError(error => {
            this.messageService.showErrorWithCode('messages.tabs.quota.modals.delete.error', error);
            return of(error);
          })
        ).subscribe(result => {
          if (result.status === 200) {
            this.loadSoftQuota();
            this.messageService.showSuccessMessage('messages.tabs.quota.modals.delete.success');
          }
        });
      }
    });
  }
}
