import {Component, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../users/shared/modal-options";
import {Service} from "../../../../../../shared/model/service";

@Component({
  selector: 'app-available-services-remove-modal',
  templateUrl: './available-services-remove-modal.component.html',
  styleUrl: './available-services-remove-modal.component.scss'
})
export class AvailableServicesRemoveModalComponent {

  @ViewChild('deleteServiceModal')
  private deleteServiceModal!: HclModalDialogComponent;

  protected service: Service | undefined = undefined;

  public open(service: Service): Observable<HclDialogResult> {
    this.service = service;
    return this.deleteServiceModal.open(userModalOptions);
  }

}
