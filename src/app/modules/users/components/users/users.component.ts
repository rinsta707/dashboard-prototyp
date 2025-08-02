import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HclPageEvent, HclSort, HclSortDirective } from "@hacon/hcl";
import { ViewUserModalComponent } from "./dialogs/view-user-modal/view-user-modal.component";
import { AddUserModalComponent } from "./dialogs/add-user-modal/add-user-modal.component";
import { EditUserModalComponent } from './dialogs/edit-user-modal/edit-user-modal.component';
import { DeleteUserModalComponent } from './dialogs/delete-user-modal/delete-user-modal.component';
import { catchError, of } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../../../../shared/model/user";
import { UsersService } from "../../services/users.service";
import { MessageService } from "../../../../shared/services/message.service";
import { LoggedUserService } from "../../../../shared/services/logged-user.service";
import { AuthService } from "../../../../shared/services/auth.service";
import { buildPageRequest } from "../../../../shared/model/page-request";
import { UserStatusModalComponent } from './dialogs/status-user-modal/user-status-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, AfterViewInit {

  @ViewChild(HclSortDirective)
  private sorting!: HclSortDirective;

  @ViewChild('viewUser')
  public viewUser!: ViewUserModalComponent;

  @ViewChild('editUser')
  public editUser!: EditUserModalComponent;

  @ViewChild('deleteUser')
  public deleteUser!: DeleteUserModalComponent;

  @ViewChild('addUser')
  public addUser!: AddUserModalComponent;

  @ViewChild('statusModal')
  public confirmStatus!: UserStatusModalComponent;

  protected data: User[] = [];
  protected pageEvent: HclPageEvent = { page: 1, pageSize: 10 };
  protected pageSort: HclSort = { sortBy: 'id', direction: 'asc' };
  protected dataLength: number = 0;
  protected displayedColumns: string[] = ['username', 'roles', 'status', 'actions'];
  protected userLocale: string = 'de';
  protected userPaginatorDefault: number = 10;


  constructor(protected userService: UsersService,
    private messageService: MessageService,
    private storageService: LoggedUserService,
    private authService: AuthService,
    private router: Router,
    private loggedUserService: LoggedUserService) {
  }

  public ngOnInit() {
    this.userLocale = this.loggedUserService.getLocale();
    this.userPaginatorDefault = this.loggedUserService.getPaginatorDefault();
    this.getData();
  }

  public getData() {
    if (this.pageEvent.pageSize == null) {
      this.pageEvent.pageSize = this.userPaginatorDefault;
    }
    if (this.pageEvent.pageSize == null) {
      this.pageEvent.pageSize = this.userPaginatorDefault;
    }
    let pageRequest = buildPageRequest(this.pageEvent, this.pageSort);
    this.userService.getAllPageable(pageRequest).subscribe(page => {
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

  onEditUser(element: User) {
    this.editUser.open(element);
  }

  onRemoveUser(element: User) {
    let userToRemoveIsLoggedUser = this.storageService.getUser()!.id === element.id;

    this.deleteUser.open(element, userToRemoveIsLoggedUser).subscribe(result => {
      if (result.data == true) {
        this.userService.deleteUser(element.id).pipe(
          catchError(error => {
            this.messageService.showErrorWithCode('users.modals.delete.error', error);
            return of(error);
          })
        ).subscribe(result => {
          if (result.status === 200 && !userToRemoveIsLoggedUser) {
            this.getData();
            this.messageService.showSuccessMessage('users.modals.delete.success')
          } else if (result.status === 200 && userToRemoveIsLoggedUser) {
            this.authService.logout().subscribe(result => {
              this.storageService.clear();
              this.router.navigate(['login']);
            });
          }
        });
      }
    });
  }

  onViewUser(element: User) {
    this.viewUser.open(element);
  }

  onUpdateStatus(element: User) {
    this.confirmStatus.open(element).subscribe(result => {
      if (result.data == true) {
        this.userService.updateStatus(element).pipe(
          catchError(error => {
            return of(error);
          })
        ).subscribe(result => {
          if (result.status === 200) {
            this.getData();
            this.messageService.showSuccessMessage('users.modals.status.success')
          } else {
            this.messageService.showError('users.modals.status.error');
          }
        });
      }
    });
  }

  onAddUser() {
    this.addUser.open();
  }

  saveUser(user: User) {
    this.userService.addUser(user).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 201) {
        this.addUser.close();
        this.getData();
        this.messageService.showSuccessMessage('users.modals.add.success')
      } else if (result.status === 409) {
        this.messageService.showError('users.modals.add.user-exists');
      } else {
        this.messageService.showError('users.modals.add.error');
      }
    });
  }

  editUsers(user: User) {
    this.userService.editUser(user).pipe(
      catchError(error => {
        return of(error);
      })
    ).subscribe(result => {
      if (result.status === 200) {
        this.editUser.close();
        this.getData();
        this.messageService.showSuccessMessage('users.modals.edit.success')
      } else if (result.status === 409) {
        this.messageService.showError('users.modals.edit.user-exists');
      } else {
        this.messageService.showError('users.modals.edit.error');
      }
    });
  }
}
