
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'src/app/shared/services/message.service';
import { AddLocaleModalComponent } from '../../dialog/add-locale-modal/add-locale-modal.component';
import { DeleteLocaleModalComponent } from '../../dialog/delete-locale-modal/delete-locale-modal.component';
import { catchError, of } from 'rxjs';
import { TemplateService } from 'src/app/modules/system-configuration/services/messages/template.service';
import { MessagesTemplate } from 'src/app/shared/model/messages-template';

@Component({
  selector: 'app-hard-quota-message',
  templateUrl: './hard-quota-message.component.html',
  styleUrls: ['./hard-quota-message.component.scss']
})
export class HardQuotaMessageComponent implements OnInit, AfterViewInit {
  @ViewChild('addLocale') addLocaleModal!: AddLocaleModalComponent;
  @ViewChild('deleteTemplate') deleteTemplateModal!: DeleteLocaleModalComponent;

  templates: { locale: string, template: string, id: number, quotaType: string }[] = [];

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
    this.loadHardQuotaTemplates();
  }

  ngOnInit(): void {
    this.loadHardQuotaTemplates();
  }

  loadHardQuotaTemplates(): void {
    this.templateService.getHardQuotaTemplate().subscribe((templates: MessagesTemplate[]) => {
      this.templates = templates.map(template => ({
        locale: template.locale,
        template: template.template,
        id: template.id,
        quotaType: template.quotaType
      }));
    });
  }

  onAddTemplate(): void {
    this.addLocaleModal.open();
  }

  updateTemplate(templateData: MessagesTemplate): void {
    this.templateService.updateMessageTemplate(templateData).pipe(
      catchError(error => of(error))
    ).subscribe(result => {
      if (result.status === 200) {
        this.loadHardQuotaTemplates();
        this.messageService.showSuccessMessage('messages.tabs.quota.modals.update.success');
      } else if (result.status === 409) {
        this.messageService.showError('messages.tabs.quota.modals.update.failed');
      } else {
        this.messageService.showError('messages.tabs.quota.modals.update.error');
      }
    });
  }

  saveTemplate(templateData: MessagesTemplate): void {
    templateData.quotaType = 'hard';
    this.templateService.addMessagesTemplate(templateData).pipe(
      catchError(error => of(error))
    ).subscribe(result => {
      if (result.status === 201) {
        this.addLocaleModal.close();
        this.loadHardQuotaTemplates();
        this.messageService.showSuccessMessage('messages.tabs.quota.modals.add.success');
      } else if (result.status === 409) {
        this.messageService.showError('messages.tabs.quota.modals.add.exists');
      } else {
        this.messageService.showError('messages.tabs.quota.modals.add.error');
      }
    });
  }

  deleteMessagesTemplate(element: MessagesTemplate): void {
    this.deleteTemplateModal.open(element).subscribe(result => {
      if (result.data == true) {
        this.templateService.deleteMessagesTemplate(element.id).pipe(
          catchError(error => {
            this.messageService.showErrorWithCode('messages.tabs.messages-receiver.modals.delete.error', error);
            return of(error);
          })
        ).subscribe(result => {
          if (result.status === 200) {
            this.loadHardQuotaTemplates();
            this.messageService.showSuccessMessage('messages.tabs.messages-receiver.modals.delete.success');
          }
        });
      }
    });
  }
  
}




