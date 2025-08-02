import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AvailableServicesService} from "../../services/available-services.service";
import {Service} from "../../../../shared/model/service";
import {buildPageRequest} from "../../../../shared/model/page-request";
import {HclPageEvent, HclSort, HclSortDirective} from "@hacon/hcl";
import {
  AvailableServicesViewModalComponent
} from "./dialogs/available-services-view-modal/available-services-view-modal.component";
import {
  AvailableServicesAddModalComponent
} from "./dialogs/available-services-add-modal/available-services-add-modal.component";
import {
  AvailableServicesAddStandardModalComponent
} from "./dialogs/available-services-add-standard-modal/available-services-add-standard-modal.component";
import {LoggedUserService} from "../../../../shared/services/logged-user.service";
import {catchError, of} from "rxjs";
import {MessageService} from "../../../../shared/services/message.service";
import {
  AvailableServicesRemoveModalComponent
} from "./dialogs/available-services-remove-modal/available-services-remove-modal.component";
import {
  AvailableServicesEditModalComponent
} from "./dialogs/available-services-edit-modal/available-services-edit-modal.component";

@Component({
  selector: 'app-available-services',
  templateUrl: './available-services.component.html',
  styleUrl: './available-services.component.scss'
})
export class AvailableServicesComponent implements OnInit, AfterViewInit {

  @ViewChild(HclSortDirective)
  private sorting!: HclSortDirective;

  @ViewChild('viewService')
  public viewService!: AvailableServicesViewModalComponent;

  @ViewChild('addService')
  public addService!: AvailableServicesAddModalComponent;

  @ViewChild('addStdService')
  public addStdService!: AvailableServicesAddStandardModalComponent;

  @ViewChild('editService')
  public editService!: AvailableServicesEditModalComponent;

  @ViewChild('deleteService')
  public deleteService!: AvailableServicesRemoveModalComponent;

  protected data: Service[] = [];
  protected pageEvent: HclPageEvent = { page: 1, pageSize: 10 };
  protected pageSort: HclSort = { sortBy: 'key', direction: 'asc' };
  protected dataLength: number = 0;
  protected displayedColumns: string[] = ['key', 'name', 'actions' ];
  protected userLocale: string = 'de';
  protected userPaginatorDefault: number = 10;

  constructor(private servicesService: AvailableServicesService, private loggedUserService: LoggedUserService, private messageService: MessageService) {}

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
    this.servicesService.getAllPageable(pageRequest).subscribe(page => {
      this.data = page.body!.content;
      this.dataLength = page.body!.totalElements;

      this.fillDataWithTranslations();
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

  onAddService() {
    this.addService.open();
  }

  onAddStandardService() {
    this.addStdService.open();
  }

  onEditService(element: Service) {
    this.editService.open(element);
  }

  onViewService(element: any) {
    this.servicesService.getServiceById(element.id).subscribe(service => {
      this.viewService.open(service.body!);
    });
  }

  onRemoveService(element: Service) {
    this.deleteService.open(element).subscribe(result => {
      if (result.data == true && element.id) {
        this.servicesService.deleteService(element.id).pipe(
          catchError(error => {
            this.messageService.showError('available-services.modals.delete.error');
            return of(error);
          })
        ).subscribe(() => {
          this.getData();
          this.messageService.showSuccessMessage('available-services.modals.delete.success')
        })
      }
    });
  }

  saveService(service: Service) {
    this.servicesService.addService(service).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 201) {
        this.addService.close();
        this.getData();
        this.messageService.showSuccessMessage('available-services.modals.add.success')
      } else if (result.status === 409) {
        this.messageService.showError('available-services.modals.add.service-exists');
      } else {
        this.messageService.showError('available-services.modals.add.error');
      }
    });
  }

  saveStdServices(services: number[]) {
    this.servicesService.addServices(services).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 201) {
        this.addStdService.close();
        this.getData();
        this.messageService.showSuccessMessage('available-services.modals.add.successMany')
      } else {
        this.messageService.showError('available-services.modals.add.error');
      }
    });
  }

  updateService(service: Service) {
    this.servicesService.editService(service).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 200) {
        this.editService.close();
        this.getData();
        this.messageService.showSuccessMessage('available-services.modals.edit.success')
      } else {
        this.messageService.showError('available-services.modals.edit.error');
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
