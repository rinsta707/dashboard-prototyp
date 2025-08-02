import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HclModalDialogComponent, HclDialogResult, HclElementComparator, HclSelectOption, HclTranslationService } from '@hacon/hcl';
import { Observable } from 'rxjs';
import { TemplateService } from 'src/app/modules/system-configuration/services/messages/template.service';
import { userModalOptions } from 'src/app/modules/users/shared/modal-options';
import { Language } from 'src/app/shared/model/language';
import { MessagesTemplate } from 'src/app/shared/model/messages-template';

@Component({
  selector: 'app-add-locale-modal',
  templateUrl: './add-locale-modal.component.html',
  styleUrl: './add-locale-modal.component.scss'
})
export class AddLocaleModalComponent implements OnInit, AfterViewInit{
  @Output() saveEvent = new EventEmitter<MessagesTemplate>(); 

  @ViewChild('addLocaleModal')
  private addLocaleModal!: HclModalDialogComponent;

  protected form: FormGroup;
  protected options: HclSelectOption<string>[] = [{ modelValue: '', viewValue: '' }];
  


  constructor(private fb: FormBuilder,
    private messagesService: TemplateService,
  ) {

    this.form = this.fb.group({
      locale: ['', Validators.required]
    })

  }
  ngAfterViewInit(): void {
    this.initializeLocaleOptions();
  }
  ngOnInit(): void {
    this.initializeLocaleOptions();

  }

  public open(): Observable<HclDialogResult> {
    this.form.reset();
    return this.addLocaleModal.open(userModalOptions);
  }

  public close() {
    this.addLocaleModal.cancel();
  }

  public onSave() {
    if (this.form.valid) {
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  public compareLanguageByCode: HclElementComparator<string> = (thisCountry: string, thatCountry: string) => {
    if (thisCountry == null || thatCountry == null) {
      return false;
    }
    return thisCountry === thatCountry;
  }


  private initializeLocaleOptions() {
    
    this.messagesService.getLanguages().subscribe((languages: Language[]) => {
      this.options = [];
      languages.forEach(languages => {
        this.options.push({modelValue: languages.locale, viewValue: languages.locale})
      })
    });
    
  }

  
  
}

