import {Component, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../users/shared/modal-options";
import {ProvisioningOption} from "../../../../../../shared/model/provisioning-option";

@Component({
  selector: 'app-provisioning-options-remove-modal',
  templateUrl: './provisioning-options-remove-modal.component.html',
  styleUrl: './provisioning-options-remove-modal.component.scss'
})
export class ProvisioningOptionsRemoveModalComponent {

  @ViewChild('deleteOptionModal')
  private deleteOptionModal!: HclModalDialogComponent;

  protected option: ProvisioningOption | undefined = undefined;

  public open(option: ProvisioningOption): Observable<HclDialogResult> {
    this.option = option;
    return this.deleteOptionModal.open(userModalOptions);
  }

}
