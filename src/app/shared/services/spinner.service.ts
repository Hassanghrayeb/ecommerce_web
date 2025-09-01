import {Injectable} from '@angular/core';
import {HttpRequest} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable()
export class SpinnerService {
  private _pendingRequests: HttpRequest<any>[] | any[] = [];

  constructor(private _ngxSpinnerService: NgxSpinnerService) {
  }

  public pushRequest(req: HttpRequest<any> | any): void {
    this._pendingRequests.push(req);
    this.show();
  }

  public popRequest(): void {
    this._pendingRequests.pop();
    this.updateSpinnerVisibility();
  }

  public popAllRequest(): void {
    this._pendingRequests = [];
    this.updateSpinnerVisibility();
  }

  public show(): void {
    this._ngxSpinnerService.show();
  }

  public hide(): void {
    this._ngxSpinnerService.hide();
  }

  public forceShowLoader(): void {
    this._ngxSpinnerService.show();
  }

  public forceHideLoader(): void {
    this._ngxSpinnerService.hide();
  }

  public resetPendingRequests(): void {
    this._pendingRequests = [];
    this.updateSpinnerVisibility();
  }

  private updateSpinnerVisibility(): void {
    const numberOfPendingRequests = this.getNumberOfPendingRequests();
    if (numberOfPendingRequests === 0) {
      this.hide();
    }
  }

  private getNumberOfPendingRequests(): number {
    return this._pendingRequests != null ? this._pendingRequests.length : 0;
  }
}
