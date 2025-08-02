import {Injectable, OnDestroy} from '@angular/core';
import {HclMessageQueueService, HclSnackbarService, HclTranslationService} from "@hacon/hcl";
import {Subject, takeUntil} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy {

  private readonly onDestroy = new Subject<void>();

  constructor(private readonly messageQueue: HclMessageQueueService,
              private snackbarService: HclSnackbarService,
              private translate: HclTranslationService) { }

  public showSuccessMessage(message: string) {
    this.translate.get(message).pipe(takeUntil(this.onDestroy)).subscribe(result => {
      this.snackbarService.openSnackbar(result, {
        color: 'success',
        icon: 'mat::check',
        size: 'fit-content'
      });
    })
  }

  public showError(message: string) {
    this.translate.get(message).pipe(takeUntil(this.onDestroy)).subscribe(result => {
      this.messageQueue.registerMessage({
        message: result,
        type: 'error'
      });
    })
  }

  public showErrorWithCode(message: string, error: any) {
    this.translate.get(message).pipe(takeUntil(this.onDestroy)).subscribe(result => {
      this.messageQueue.registerMessage({
        message: result + ': ' + + error.status + ' ' + error.statusText,
        type: 'error'
      });
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}
