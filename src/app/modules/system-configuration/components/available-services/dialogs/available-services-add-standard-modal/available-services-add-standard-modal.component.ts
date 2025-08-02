import {AfterViewInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent, HclPageEvent, HclSort, HclSortDirective} from "@hacon/hcl";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../users/shared/modal-options";
import {Service} from "../../../../../../shared/model/service";
import {AvailableServicesService} from "../../../../services/available-services.service";
import {buildPageRequest} from "../../../../../../shared/model/page-request";
import {LoggedUserService} from "../../../../../../shared/services/logged-user.service";

@Component({
  selector: 'app-available-services-add-standard-modal',
  templateUrl: './available-services-add-standard-modal.component.html',
  styleUrl: './available-services-add-standard-modal.component.scss'
})
export class AvailableServicesAddStandardModalComponent implements AfterViewInit {

  @Output() saveEvent = new EventEmitter<number[]>();

  @ViewChild('addStdServiceModal')
  private addStdServiceModal!: HclModalDialogComponent;

  @ViewChild(HclSortDirective)
  private sorting!: HclSortDirective;

  protected data: Service[] = [];
  protected pageEvent: HclPageEvent = { page: 1, pageSize: 10 };
  protected pageSort: HclSort = { sortBy: 'key', direction: 'asc' };
  protected dataLength: number = 0;
  protected displayedColumns: string[] = ['actionCheckbox', 'key', 'name', 'client'];
  protected userLocale: string = 'de';
  protected userPaginatorDefault: number = 10;
  protected selectedServices: number[] = [];

  constructor(private servicesService: AvailableServicesService, private storageService: LoggedUserService) {}

  public open(): Observable<HclDialogResult> {
    this.userLocale = this.storageService.getLocale();
    this.userPaginatorDefault = this.storageService.getPaginatorDefault();
    this.getData();
    return this.addStdServiceModal.open(userModalOptions);
  }

  private getData() {
    if (this.pageEvent.pageSize == null) {
      this.pageEvent.pageSize = this.userPaginatorDefault;
    }
    let pageRequest = buildPageRequest(this.pageEvent, this.pageSort);
    this.servicesService.getStandardPageable(pageRequest).subscribe(page => {
      this.data = page.body!.content;
      this.dataLength = page.body!.totalElements;

      this.fillDataWithTranslations();
      this.updateSelectedServices();
    });
  }

  private fillDataWithTranslations() {
    this.data.forEach(service => {
      service.translations.forEach(translation => {
        if (translation.locale === this.userLocale) {
          service.name = translation.description;
        }
      });
    });
  }

  onSave() {
    this.saveEvent.emit(this.selectedServices);
  }

  public close() {
    this.clear();
    this.addStdServiceModal.cancel();
  }

  onSelectChange(event: any, service: Service) {
    if (event == true && service.id) {
      this.selectedServices.push(service.id);
    } else {
      this.selectedServices = this.selectedServices.filter(id => id !== service.id);
    }
  }

  private updateSelectedServices() {
    this.data.forEach(service => {
      if (service.id) {
        service.selected = this.selectedServices.includes(service.id);
      }
    });
  }

  protected clear() {
    this.selectedServices = [];
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
