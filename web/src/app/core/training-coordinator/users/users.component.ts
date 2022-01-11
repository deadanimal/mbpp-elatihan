import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { User } from 'src/app/shared/services/users/users.model';
import { UsersService } from 'src/app/shared/services/users/users.service';

import { Department, Section, ServiceStatus, UserType } from 'src/app/shared/code/user';
import swal from 'sweetalert2';
import * as moment from 'moment';
import * as xlsx from 'xlsx';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CustomValidators } from 'src/app/shared/validators/custom/custom-validators';


export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  //  Data
  users: User[] = []
  selectedUser: User
  departments = Department

  // Form
  userForm: FormGroup

  // Table
  tableEntries: number = 5
  tableSelected: any[] = []
  tableTemp = []
  passwordForm: FormGroup
  passwordFormMessages = {
    'new_password1': [
      { type: 'required', message: 'Kata laluan diperlukan' },
      { type: 'minlength', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 8 aksara' },
      { type: 'hasNumber', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 1 digit' },
      // { type: 'hasCapitalCase', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 1 huruf besar' },
      // { type: 'hasSmallCase', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 1 huruf kecil' }
    ],
    'new_password2': [
      { type: 'required', message: 'Ulang kata laluan diperlukan' },
      { type: 'NoPassswordMatch', message: 'Kata laluan tidak sepadan' }
    ]
  }
  tableActiveRow: any
  tableRows: any = []
  tableMessages = {
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  SelectionType = SelectionType;

  // Checker
  isEmpty: boolean = true

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: 'modal-dialog-centered'
  };

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  constructor(
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    private notifyService: NotifyService,
    private authService: AuthService,
    private router: Router
  ) { 
    this.getData()
  }

  ngOnInit() {
    this.initForm()

    this.passwordForm = this.formBuilder.group(
      {
        new_password1: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true,
            }),
            // CustomValidators.patternValidator(/[A-Z]/, {
            //   hasCapitalCase: true
            // }),
            // // check whether the entered password has a lower case letter
            // CustomValidators.patternValidator(/[a-z]/, {
            //   hasSmallCase: true
            // })
          ])
        ),
        new_password2: new FormControl(
          null,
          Validators.compose([Validators.required])
        ),
      },
      { validator: CustomValidators.passwordMatchValidator }
    );
  }

  getData() {
    this.loadingBar.start()
    forkJoin([
      this.userService.getAll()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
        this.users = this.userService.users
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.tableRows = this.users
        this.tableTemp = this.tableRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key + 1
          };
        });

        if (this.tableTemp.length >= 1) {
          this.isEmpty = false
        }
        else {
          this.isEmpty = true
        }
      }
    )
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      user_type: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })
  }

  changeInput(input: any, input2:any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
    input2.type = input2.type === 'password' ? 'text' : 'password';
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == 'name') {
      this.tableTemp = this.tableRows.filter(function (d) {
        return d.full_name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'user_type') {
      if (val == 'aa') {
        this.tableTemp = this.tableRows
      }
      else {
        this.tableTemp = this.tableRows.filter(function (d) {
          return d.user_type.toLowerCase().indexOf(val) !== -1 || !val;
        });
      }
    }
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  patch() {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Pengguna sedang dikemaskini'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    this.userService.update(this.selectedUser['id'], this.userForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk mengemaskini pengguna. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.closeModal()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Pengguna berjaya dikemaskini.'
        this.notifyService.openToastr(title, message)
        this.success()
        this.closeModal()
        this.getData()
      }
    )
  }

  openModal(modalRef: TemplateRef<any>, row) {
    this.selectedUser = row
    this.userForm.controls['user_type'].setValue(this.selectedUser['user_type'])

    this.modal = this.modalService.show(modalRef, this.modalConfig);
    // console.log('Wee', this.userForm.value)
  }

  closeModal() {
    this.modal.hide()
    this.userForm.reset()
  }

  confirm() {
    // console.log('Wee', this.examForm.value)
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk mengemaskini pengguna ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.patch()
      }
    })
  }

  success() {
    swal.fire({
      title: 'Berjaya',
      text: 'Pengguna berjaya dikemaskini',
      type: 'success',
      buttonsStyling: false,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonClass: 'btn btn-outline-success',
      cancelButtonText: 'Tutup'
    })
  }

  exportExcel() {
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileName = 'Ringkasan_Pengguna_' + todayDateFormat + '.xlsx'
    let element = document.getElementById('summaryTable'); 
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, fileName);
  }

  changePassword() {
    this.loadingBar.start();
    console.log(this.passwordForm.value);
    this.userService.changePassword(this.selectedUser.id, this.passwordForm.value['new_password1']).subscribe(
      (res)=> {
        console.log(res)
        this.loadingBar.complete()
      },
      (error) => {
        this.loadingBar.complete();
        let title = "Ralat";
        let message =
          "Kata laluan tidak berjaya dikemaskini. Sila cuba sekali lagi";
        this.notifyService.openToastrError(title, message);
      },
      () => {
        let title = "Berjaya";
        let message =
          "Kata laluan berjaya dikemaskini. Sila log masuk semula menggunakan kata laluan baru";
        this.notifyService.openToastr(title, message);
        this.closeModal();
      }
    )
    // this.authService.changePassword(this.passwordForm.value).subscribe(
    //   () => {
    //     this.loadingBar.complete();
    //   },
    //   () => {
    //     this.loadingBar.complete();
    //     let title = "Ralat";
    //     let message =
    //       "Kata laluan tidak berjaya dikemaskini. Sila cuba sekali lagi";
    //     this.notifyService.openToastrError(title, message);
    //   },
    //   () => {
    //     let title = "Berjaya";
    //     let message =
    //       "Kata laluan berjaya dikemaskini. Sila log masuk semula menggunakan kata laluan baru";
    //     this.notifyService.openToastr(title, message);
    //     this.closeModal();
    //   }
    // );
  }

  view(row) {
    let path = '/tc/trainings/applicant-histories'
    let extras = row.id
    let queryParams = {
      queryParams: {
        id: extras
      }
    }
    this.router.navigate([path], queryParams)
  }

}
