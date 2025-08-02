import { Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {HclElementComparator, HclIconRegistryService, HclSelectOption, HclTranslationService} from '@hacon/hcl';
import {User} from 'src/app/shared/model/user';
import {MessageService} from 'src/app/shared/services/message.service';
import {MyAccountService} from '../../services/my-account.service';
import {catchError, of} from "rxjs";
import {FormBuilder, FormGroup} from '@angular/forms';
import {ChangePasswordModalComponent} from './dialogs/change-password-modal/change-password-modal.component';
import {LoggedUserService} from 'src/app/shared/services/logged-user.service';
import { UserRoleCheck } from 'src/app/shared/services/user-role-check.service';



@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
})
export class MyAccountComponent implements OnInit {

  @ViewChild('changePassword')
  public changePassword!: ChangePasswordModalComponent;

  @Output() saveEvent = new EventEmitter<User>();

  protected form: FormGroup;
  protected username: string = '';
  protected isAdmin: boolean = false;

  protected localeOptions: HclSelectOption<string>[] = [];
  protected defaultPageSizeOptions: HclSelectOption<number>[] = [];

  constructor(private fb: FormBuilder,
              protected myAccountService: MyAccountService,
              private messageService: MessageService,
              private loggedUserService: LoggedUserService,
              iconRegistry: HclIconRegistryService,
              private translate: HclTranslationService,
              private rolesCheck: UserRoleCheck
              ) {

    this.initializeUsername();
    this.initializeLocaleOptions();
    this.initializeDefaultPageSizeOptions();

    this.isAdmin= this.rolesCheck.isAdmin() || this.rolesCheck.isSystemAdmin();

    iconRegistry.addSvgIconUrlToSet('languageLocale', 'germany', 'assets/countries/flags/de.svg');
    iconRegistry.addSvgIconUrlToSet('languageLocale', 'england', 'assets/countries/flags/gb.svg');

    this.form = this.fb.group({
      paginatorDefault: [''],
      locale: ['en'],
      notifications: [{ value: 'false'}]
    });
  }

  private initializeUsername() {
    let user = this.loggedUserService.getUser();
    this.username = user ? user.username : '';
  }

  private initializeLocaleOptions() {
    this.localeOptions = [
      {
        modelValue: 'de',
        viewValue: this.translate.instant('my-account.locales.de-DE'),
        icon: 'languageLocale::germany'
      },
      {
        modelValue: 'en',
        viewValue: this.translate.instant('my-account.locales.en-GB'),
        icon: 'languageLocale::england'
      }
    ];
  }

  private initializeDefaultPageSizeOptions() {
    this.defaultPageSizeOptions = [
      {
        modelValue: 5,
        viewValue: 5
      },
      {
        modelValue: 10,
        viewValue: 10
      },
      {
        modelValue: 25,
        viewValue: 25
      },
      {
        modelValue: 100,
        viewValue: 100
      }
    ];
  }

  ngOnInit(): void {
    this.loadDefaultSettings();
  }

  onEditPassword() {
    this.changePassword.open();
  }

  editPassword(user: User) {
    this.myAccountService.updateSettings(user).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 200) {
        this.changePassword.close();
        this.messageService.showSuccessMessage('my-account.modals.password.success');
      } else {
        this.messageService.showError('my-account.modals.password.error');
      }
    });
  }

  saveSettings() {
    if (this.form.valid) {
      this.myAccountService.updateSettings(this.form.value).pipe(
        catchError(error => {
          return of(error);
        })
      ).subscribe(result => {
        if (result.status === 200) {
          this.loadDefaultSettings();
          this.messageService.showSuccessMessage('my-account.result.success');

        } else if (result.status === 401) {
          this.messageService.showError('my-account.result.error');
        } else {
          this.messageService.showError('my-account.result.error');
        }
      });
    } else {
      this.form.markAsTouched();
    }
  }

  loadDefaultSettings(): void {
    let id = this.loggedUserService.getUser()!.id;
    this.myAccountService.getSettings(id).subscribe(result => {
      this.form.patchValue(result.body!)

      this.loggedUserService.updateUserSettings(result.body!);
    });
  }

  public compareLocaleByCode: HclElementComparator<string> = (thisCountry: string, thatCountry: string) => {
    if (thisCountry == null || thatCountry == null) {
      return false;
    }
    return thisCountry === thatCountry;
  }

  public compareDefaultPageSizeOptions: HclElementComparator<number> = (thisDefault: number, thatDefault: number) => {
    if (thisDefault == null || thatDefault == null) {
      return false;
    }
    return thisDefault === thatDefault;
  }
}
