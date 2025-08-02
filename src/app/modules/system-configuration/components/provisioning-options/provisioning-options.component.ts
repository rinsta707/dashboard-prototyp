import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HclPageEvent, HclSort, HclSortDirective} from "@hacon/hcl";
import {ProvisioningOptionsService} from "../../services/provisioning-options.service";
import {LoggedUserService} from "../../../../shared/services/logged-user.service";
import {MessageService} from "../../../../shared/services/message.service";
import {buildPageRequest} from "../../../../shared/model/page-request";
import {ProvisioningOption} from "../../../../shared/model/provisioning-option";
import {catchError, of} from "rxjs";
import {
  ProvisioningOptionsAddStandardModalComponent
} from "./dialogs/provisioning-options-add-standard-modal/provisioning-options-add-standard-modal.component";
import {
  ProvisioningOptionsViewModalComponent
} from "./dialogs/provisioning-options-view-modal/provisioning-options-view-modal.component";
import {
  ProvisioningOptionsRemoveModalComponent
} from "./dialogs/provisioning-options-remove-modal/provisioning-options-remove-modal.component";
import {
  ProvisioningOptionsAddCustomModalComponent
} from "./dialogs/provisioning-options-add-custom-modal/provisioning-options-add-custom-modal.component";
import {
  ProvisioningOptionsEditModalComponent
} from "./dialogs/provisioning-options-edit-modal/provisioning-options-edit-modal.component";

@Component({
  selector: 'app-provisioning-options',
  templateUrl: './provisioning-options.component.html',
  styleUrl: './provisioning-options.component.scss'
})
export class ProvisioningOptionsComponent implements OnInit, AfterViewInit {

  @ViewChild(HclSortDirective)
  private sorting!: HclSortDirective;

  @ViewChild('viewOption')
  public viewOption!: ProvisioningOptionsViewModalComponent;

  @ViewChild('editOption')
  public editOption!: ProvisioningOptionsEditModalComponent;

  @ViewChild('deleteOption')
  public deleteOption!: ProvisioningOptionsRemoveModalComponent;

  @ViewChild('addStdOption')
  public addStdOptions!: ProvisioningOptionsAddStandardModalComponent;

  @ViewChild('addCustomOption')
  public addCustomOption!: ProvisioningOptionsAddCustomModalComponent;

  protected data: ProvisioningOption[] = [];
  protected pageEvent: HclPageEvent = { page: 1, pageSize: 10 };
  protected pageSort: HclSort = { sortBy: 'key', direction: 'asc' };
  protected dataLength: number = 0;
  protected displayedColumns: string[] = ['key', 'name', 'description', 'type', 'actions' ];
  protected userLocale: string = 'de';
  protected userPaginatorDefault: number = 10;

  constructor(private provisioningService: ProvisioningOptionsService, private loggedUserService: LoggedUserService, private messageService: MessageService) {}

  public ngOnInit() {
    this.userLocale = this.loggedUserService.getLocale();
    this.userPaginatorDefault = this.loggedUserService.getPaginatorDefault();
    this.getData();
  }

  public getData() {
    if (this.pageEvent.pageSize == null) {
      this.pageEvent.pageSize = this.userPaginatorDefault;
    }
    let pageRequest = buildPageRequest(this.pageEvent, this.pageSort);
    this.provisioningService.getAllPageable(pageRequest).subscribe(page => {
      this.data = page.body!.content;
      this.dataLength = page.body!.totalElements;

      this.fillDataWithTranslations();
    });
  }

  private fillDataWithTranslations() {
    this.data.forEach(option => {
      option.names.forEach(translation => {
        if (translation.locale === this.userLocale) {
          option.name = translation.description;
        }
      });

      option.descriptions.forEach(translation => {
        if (translation.locale === this.userLocale) {
          option.description = translation.description;
        }
      });
    });
  }

  saveStdProvisioningOptions(options: number[]) {
    this.provisioningService.addProvisioningOptions(options).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 201) {
        this.addStdOptions.close();
        this.getData();
        this.messageService.showSuccessMessage('provisioning-options.modals.add.successMany')
      } else {
        this.messageService.showError('provisioning-options.modals.add.error');
      }
    });
  }

  saveCustomOption(option: ProvisioningOption) {
    this.provisioningService.addProvisioningOption(option).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 201) {
        this.addCustomOption.close();
        this.getData();
        this.messageService.showSuccessMessage('provisioning-options.modals.add.success')
      } else {
        this.messageService.showError('provisioning-options.modals.add.error');
      }
    });
  }

  updateProvisioningOption(option: ProvisioningOption) {
    this.provisioningService.editProvisioningOption(option).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 200) {
        this.editOption.close();
        this.getData();
        this.messageService.showSuccessMessage('provisioning-options.modals.edit.success')
      } else {
        this.messageService.showError('provisioning-options.modals.edit.error');
      }
    });
  }

  onAddStandardProvisioningOption() {
    this.addStdOptions.open();
  }

  onAddCustomProvisioningOption() {
    this.addCustomOption.open();
  }

  onViewProvisioningOption(element: ProvisioningOption) {
    this.provisioningService.getProvisioningOptionById(element.id!).subscribe(option => {
      this.viewOption.open(option.body!);
    });
  }

  onEditProvisioningOption(element: ProvisioningOption) {
    this.provisioningService.getProvisioningOptionById(element.id!).subscribe(option => {
      this.editOption.open(option.body!);
    })
  }

  onRemoveProvisioningOption(option: ProvisioningOption) {
    this.deleteOption.open(option).subscribe(result => {
      if (result.data == true && option.id) {
        this.provisioningService.deleteProvisioningOption(option.id).pipe(
          catchError(error => {
            this.messageService.showError('provisioning-options.modals.delete.error');
            return of(error);
          })
        ).subscribe(() => {
          this.getData();
          this.messageService.showSuccessMessage('provisioning-options.modals.delete.success')
        })
      }
    });
  }

  onSortChange(pageSort: HclSort) {
    this.pageSort = pageSort;
    this.getData();
  }

  public onPageChange(pageEvent: HclPageEvent) {
    this.pageEvent = pageEvent;
    this.getData();
  }

  public assertDataType(data: ProvisioningOption): any {
    return data;
  }

  public ngAfterViewInit() {
    this.sorting.resort$.subscribe(next => {
      const sortBy = next.sortBy;
      const direction = next.direction;

      this.data.sort((left: any, right: any) => {
        let result: number = 0;

        if (left[sortBy] != null && right[sortBy] != null) {
          result = left[sortBy] < right[sortBy] ? -1 : 1;
        }
        if (direction === 'desc') {
          result *= -1;
        }
        return result;
      });
    });
  }



}
