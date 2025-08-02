import {Component, ViewChild} from '@angular/core';
import {HclDialogResult, HclModalDialogComponent} from "@hacon/hcl";
import {Observable} from "rxjs";
import {userModalOptions} from "../../../../../../users/shared/modal-options";
import {ProvisioningOptionRestriction} from "../../../../../../../shared/model/provisioning-option-restriction";

@Component({
  selector: 'app-provisioning-restriction-remove-modal',
  templateUrl: './provisioning-restriction-remove-modal.component.html',
  styleUrl: './provisioning-restriction-remove-modal.component.scss'
})
export class ProvisioningRestrictionRemoveModalComponent {

  @ViewChild('deleteRestrictionModal')
  private deleteRestrictionModal!: HclModalDialogComponent;

  protected restriction: ProvisioningOptionRestriction | undefined = undefined;

  public open(restriction: ProvisioningOptionRestriction): Observable<HclDialogResult> {
    this.restriction = restriction;
    return this.deleteRestrictionModal.open(userModalOptions);
  }

}
