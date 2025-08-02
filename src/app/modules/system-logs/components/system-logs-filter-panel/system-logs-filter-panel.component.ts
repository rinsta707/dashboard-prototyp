import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { HclSelectOption, HclTranslationService} from "@hacon/hcl";
import {SystemLogsService} from "../../services/system-logs.service";
import {User} from "../../../../shared/model/user";
import {HclDisabledDates} from "@hacon/hcl/lib/dt/calendar/hcl-disabled-dates";
import {SystemLogsFilterParameters} from "../../model/filter-parameters";

@Component({
  selector: 'app-system-logs-filter-panel',
  templateUrl: './system-logs-filter-panel.component.html',
  styleUrl: './system-logs-filter-panel.component.scss'
})
export class SystemLogsFilterPanelComponent implements OnInit {

  @Output() filterEvent = new EventEmitter<SystemLogsFilterParameters>();
  @Output() clearEvent = new EventEmitter<void>();

  constructor(private systemLogsService: SystemLogsService, private translate: HclTranslationService) { }

  protected dateFrom: Date = new Date();
  protected dateTo: Date = new Date();
  protected selectedUsers: number[] = [];
  protected selectedOperations: string[] = [];
  protected selectSuccess: boolean = true;
  protected selectFailure: boolean = true;
  protected messageText: string = '';

  selectUserOptions: HclSelectOption<number>[] = [
    {modelValue: 0, viewValue: ''}
  ]

  selectOperationsOptions: HclSelectOption<string>[] = [
    {modelValue: '', viewValue: ''}
  ]

  getUsersFromLogs(): void {
    this.systemLogsService.getUsersFromLogs().subscribe((users: User[]) => {
      this.selectUserOptions = [];
      users.forEach(user => {
        this.selectUserOptions.push({modelValue: user.id, viewValue: user.username});
        this.selectedUsers = [...this.selectedUsers, user.id];
      })
    });
  }

  getOperationsFromLogs(): void {
    this.systemLogsService.getOperationsFromLogs().subscribe((operations: string[]) => {
      this.selectOperationsOptions = [];
      operations.forEach(operation => {
        let operationName: string = this.translate.instant('system-logs.table.operations.' + operation);
        this.selectOperationsOptions.push({modelValue: operation, viewValue: operationName});
        this.selectedOperations = [...this.selectedOperations, operation];
      })
    });
  }

  getDatesFromLogs(): void {
    this.systemLogsService.getDatesFromLogs().subscribe((dates: {FROM: string, TO: string}) => {
      if (dates.FROM) {
        this.dateFrom = new Date(dates.FROM);
      }
      if (dates.TO) {
        this.dateTo = new Date(dates.TO);
      }
    });
  }


  ngOnInit(): void {
    this.updateFields();
  }

  onFilter() {
    let filterParameters: SystemLogsFilterParameters = {
      dateFrom: this.dateFrom.toISOString(),
      dateTo: this.dateTo.toISOString(),
      users: this.selectedUsers,
      operations: this.selectedOperations,
      success: this.selectSuccess,
      failure: this.selectFailure,
      text: this.messageText
    }

    this.filterEvent.emit(filterParameters);
  }

  onClear() {
    this.selectUserOptions =  [{modelValue: 0, viewValue: ''}];
    this.selectOperationsOptions = [{modelValue: '', viewValue: ''}];
    this.selectedUsers=  [];
    this.selectedOperations = [];
    this.selectSuccess = true;
    this.selectFailure = true;
    this.messageText = '';
    this.updateFields();

    this.clearEvent.emit();
  }

  private updateFields() {
    this.getUsersFromLogs();
    this.getOperationsFromLogs();
    this.getDatesFromLogs();
  }
}
