import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    public toastr: ToastrService
  ) { }

  openToastrConnection() {
    let status = 'Error'
    let statusText = 'No connection'
    this.toastr.info(statusText, status)
  }

  openToastrHttp(status: any, statusText: string) {
    this.toastr.warning(statusText, status)
  }

  openToastr(status: any, statusText: string) {
    this.toastr.success(statusText, status)
  }

}
