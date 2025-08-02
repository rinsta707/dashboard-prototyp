import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {HclSortDirective} from "@hacon/hcl";
import {LoggedUserService} from "../../../../../shared/services/logged-user.service";
import {ProvisioningOptionRestriction} from "../../../../../shared/model/provisioning-option-restriction";
import {
  ProvisioningRestrictionEditModalComponent
} from "./dialogs/provisioning-restriction-edit-modal/provisioning-restriction-edit-modal.component";
import {
  ProvisioningRestrictionViewModalComponent
} from "./dialogs/provisioning-restriction-view-modal/provisioning-restriction-view-modal.component";
import {
  ProvisioningRestrictionRemoveModalComponent
} from "./dialogs/provisioning-restriction-remove-modal/provisioning-restriction-remove-modal.component";
import {
  ProvisioningRestrictionAddModalComponent
} from "./dialogs/provisioning-restriction-add-modal/provisioning-restriction-add-modal.component";
import {MessageService} from "../../../../../shared/services/message.service";

@Component({
  selector: 'app-provisioning-restrictions',
  templateUrl: './provisioning-restrictions.component.html',
  styleUrl: './provisioning-restrictions.component.scss'
})
export class ProvisioningRestrictionsComponent implements OnInit, AfterViewInit {

  @Input() viewOnly: boolean = false;
  @Input() data: ProvisioningOptionRestriction[] = [];

  @ViewChild(HclSortDirective)
  private sorting!: HclSortDirective;

  @ViewChild('addRestriction')
  public addRestriction!: ProvisioningRestrictionAddModalComponent;

  @ViewChild('editRestriction')
  public editRestriction!: ProvisioningRestrictionEditModalComponent;

  @ViewChild('viewRestriction')
  public viewRestriction!: ProvisioningRestrictionViewModalComponent;

  @ViewChild('deleteRestriction')
  public deleteRestriction!: ProvisioningRestrictionRemoveModalComponent;

  protected displayedColumns: string[] = ['value', 'translation', 'actions'];
  protected userLocale: string = 'de';

  constructor(private messageService: MessageService) {}

  public ngOnInit() {
    this.data = this.data.sort((a, b) => a.value.localeCompare(b.value));
  }

  private fillDataWithTranslations() {
    this.data?.forEach(option => {
      option.translations.forEach(translation => {
        if (translation.locale === this.userLocale) {
          option.translation = translation.description;
        }
      });
    });
  }

  saveProvisioningRestriction(restriction: ProvisioningOptionRestriction) {
    if (this.data.filter(data => data.value === restriction.value).length > 0) {
      this.messageService.showError('provisioning-restrictions.modals.add.value-exists');
    } else {
      this.data.push(restriction);
      this.addRestriction.close();
    }

    this.fillDataWithTranslations();
  }

  editProvisioningRestriction(editedRestriction: ProvisioningOptionRestriction) {
    if (editedRestriction.id) {
      this.data = this.data.filter(restriction => restriction.id !== editedRestriction.id);
    } else {
      this.data = this.data.filter(restriction => restriction.value !== editedRestriction.value);
    }
    this.data.push(editedRestriction);
    this.editRestriction.close();

    this.fillDataWithTranslations();
  }

  onRemoveProvisioningRestriction(restrictionToRemove: ProvisioningOptionRestriction) {
    this.deleteRestriction.open(restrictionToRemove).subscribe(result => {
      if (result.data == true && restrictionToRemove.id) {
        this.data = this.data.filter(restriction => restriction.id !== restrictionToRemove.id);
      } else {
        this.data = this.data.filter(restriction => restriction.value !== restrictionToRemove.value);
      }
    })
  }

  onAddProvisioningRestriction() {
    this.addRestriction.open();
  }

  onViewProvisioningRestriction(restriction: ProvisioningOptionRestriction) {
    this.viewRestriction.open(restriction);
  }

  onEditProvisioningRestriction(restriction: ProvisioningOptionRestriction) {
    this.editRestriction.open(restriction);
  }

  public getRestrictions(): ProvisioningOptionRestriction[] {
    return this.data;
  }

  public assertDataType(data: ProvisioningOptionRestriction): any {
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
