import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HclPageEvent, HclSort, HclSortDirective} from "@hacon/hcl";
import {SystemLog} from "../../../../shared/model/system-log";
import {SystemLogsService} from "../../services/system-logs.service";
import {buildPageRequest} from "../../../../shared/model/page-request";
import {SystemLogsFilterParameters} from "../../model/filter-parameters";
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

@Component({
  selector: 'app-system-logs',
  templateUrl: './system-logs.component.html',
  styleUrl: './system-logs.component.scss'
})
export class SystemLogsComponent implements OnInit, AfterViewInit {


  @ViewChild(HclSortDirective)
  private sorting!: HclSortDirective;

  protected data: SystemLog[] = [];
  protected pageEvent: HclPageEvent = { page: 1, pageSize: 10 };
  protected pageSort: HclSort = { sortBy: 'id', direction: 'desc' };
  protected dataLength: number = 0;
  protected displayedColumns: string[] = ['timestamp', 'createdBy', 'operation', 'result', 'message'];
  protected filterParameters: SystemLogsFilterParameters | undefined;
  protected userLocale: string = 'de';
  protected userPaginatorDefault: number = 10;

  constructor(private logsService: SystemLogsService,
    private loggedUserService: LoggedUserService,
  ) { }

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
    this.logsService.getAllPageable(pageRequest, this.filterParameters).subscribe(page => {
      this.data = page.body!.content;
      this.dataLength = page.body!.totalElements;
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

  public assertDataType(data: any): any {
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

  setFilterParameters(filterParameters?: SystemLogsFilterParameters) {
    this.filterParameters = filterParameters;
    this.getData();
  }


}
