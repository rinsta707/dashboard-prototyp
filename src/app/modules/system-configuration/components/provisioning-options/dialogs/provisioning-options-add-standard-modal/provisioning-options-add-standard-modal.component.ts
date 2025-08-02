import {AfterViewInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent, HclPageEvent, HclSort, HclSortDirective} from "@hacon/hcl";
import {Service} from "../../../../../../shared/model/service";
import {LoggedUserService} from "../../../../../../shared/services/logged-user.service";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../users/shared/modal-options";
import {buildPageRequest} from "../../../../../../shared/model/page-request";
import {ProvisioningOption} from "../../../../../../shared/model/provisioning-option";
import {ProvisioningOptionsService} from "../../../../services/provisioning-options.service";

@Component({
  selector: 'app-provisioning-options-add-standard-modal',
  templateUrl: './provisioning-options-add-standard-modal.component.html',
  styleUrl: './provisioning-options-add-standard-modal.component.scss'
})
export class ProvisioningOptionsAddStandardModalComponent implements AfterViewInit {

  @Output() saveEvent = new EventEmitter<number[]>();

  @ViewChild('addStdOptionModal')
  private addStdOptionModal!: HclModalDialogComponent;

  @ViewChild(HclSortDirective)
  private sorting!: HclSortDirective;

  protected data: ProvisioningOption[] = [];
  protected pageEvent: HclPageEvent = { page: 1, pageSize: 10 };
  protected pageSort: HclSort = { sortBy: 'key', direction: 'asc' };
  protected dataLength: number = 0;
  protected displayedColumns: string[] = ['actionCheckbox', 'key', 'name', 'description', 'type' ];
  protected userLocale: string = 'de';
  protected userPaginatorDefault: number = 10;
  protected selectedOptions: number[] = [];

  constructor(private provisioningService: ProvisioningOptionsService, private storageService: LoggedUserService) {}

  public open(): Observable<HclDialogResult> {
    this.userLocale = this.storageService.getLocale();
    this.userPaginatorDefault = this.storageService.getPaginatorDefault();
    this.getData();
    return this.addStdOptionModal.open(userModalOptions);
  }

  private getData() {
    if (this.pageEvent.pageSize == null) {
      this.pageEvent.pageSize = this.userPaginatorDefault;
    }
    let pageRequest = buildPageRequest(this.pageEvent, this.pageSort);
    this.provisioningService.getStandardPageable(pageRequest).subscribe(page => {
      this.data = page.body!.content;
      this.dataLength = page.body!.totalElements;

      this.fillDataWithTranslations();
      this.updateSelectedServices();
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

  onSave() {
    this.saveEvent.emit(this.selectedOptions);
  }

  public close() {
    this.clear();
    this.addStdOptionModal.cancel();
  }

  onSelectChange(event: any, option: ProvisioningOption) {
    if (event == true && option.id) {
      this.selectedOptions.push(option.id);
    } else {
      this.selectedOptions = this.selectedOptions.filter(id => id !== option.id);
    }
  }

  private updateSelectedServices() {
    this.data.forEach(service => {
      if (service.id) {
        service.selected = this.selectedOptions.includes(service.id);
      }
    });
  }

  protected clear() {
    this.selectedOptions = [];
    this.pageSort = { sortBy: 'key', direction: 'asc' };
    this.getData();
  }

  onSortChange(pageSort: HclSort) {
    this.pageSort = pageSort;
    this.getData();
  }

  public onPageChange(pageEvent: HclPageEvent) {
    this.pageEvent = pageEvent;
    this.getData();
  }

  public assertDataType(data: Service): any {
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
