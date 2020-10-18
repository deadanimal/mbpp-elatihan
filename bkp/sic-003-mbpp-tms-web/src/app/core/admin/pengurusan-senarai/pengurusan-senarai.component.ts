import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';

import { UsersService } from 'src/app/shared/services/users/users.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { User } from 'src/app/shared/services/users/users.model';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';

@Component({
  selector: 'app-pengurusan-senarai',
  templateUrl: './pengurusan-senarai.component.html',
  styleUrls: ['./pengurusan-senarai.component.scss']
})
export class PengurusanSenaraiComponent implements OnInit {

  // Table
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableColumns: string[] = ['full_name', 'email', 'mobile', 'department', 'user_type', 'id']
  tableSource: MatTableDataSource<any>

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  // Search
  focusSearch

  // Data
  users: User[] = []
  tempUser: User

  // Form
  userForm: FormGroup

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private modalService: BsModalService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder
  ) {
    this.userService.get().subscribe(
      () => {},
      () => {},
      () => { 
        this.users = this.userService.users 
        this.initData()
      }
    )
  }

  ngOnInit() {
    this.initData()
    this.userForm = this.formBuilder.group({
      email: new FormControl(''),
      full_name: new FormControl(''),
      telephone_number: new FormControl(''),
      new_nric: new FormControl(''),
      user_type: new FormControl(''),
      address: new FormControl(''),
      gender_type: new FormControl(''),
      grade: new FormControl(''),
      position: new FormControl(''),
      department_type: new FormControl('')
    })
  }

  initData() {
    this.tableSource = new MatTableDataSource<User>(this.users)
    this.tableSource.paginator = this.paginator;
    this.tableSource.sort = this.sort;
    //console.log(this.tableSource)
  }

  refresh() {
    this.loadingBar.start()
    this.userService.get().subscribe(
      (res) => {
        this.users = res
        this.tableSource = new MatTableDataSource<User>(res)
        this.tableSource.paginator = this.paginator;
        this.tableSource.sort = this.sort;
        this.loadingBar.complete()
        //console.log('updt', res)
      }
    )
  }

  filterTable(filterValue: string) {
    this.tableSource.filter = filterValue.trim().toLowerCase()
    console.log(this.tableSource.filter)
  }

  update() {
    this.loadingBar.start()
    //console.log(this.userForm.value)
    this.userForm.value.new_nric = this.userForm.value.username
    this.userService.update(this.userForm.value,this.tempUser.id).subscribe(
      () => {
        // console.log('Success')
        this.users = this.userService.users
        this.loadingBar.complete()
      },
      () => {
        // console.log('Unsuccess')
        this.loadingBar.complete()
      },
      () => {
        // console.log('After')
        this.successMessage()
        this.modal.hide()
        this.userForm.reset()
        this.refresh()
      }
    )
  }

  openModal(modalRef: TemplateRef<any>, user) {
    this.tempUser = user
    this.userForm.setValue({
      email: this.tempUser.email,
      full_name: this.tempUser.full_name,
      // telephone_number: this.tempUser.telephone_number,
      // new_nric: this.tempUser.new_nric,
      user_type: this.tempUser.user_type,
      // address: this.tempUser.address,
      gender_type: this.tempUser.gender,
      grade: this.tempUser.grade,
      position: this.tempUser.position,
      department_type: this.tempUser.department
    })
    this.modal = this.modalService.show(modalRef, this.modalConfig)
  }

  closeModal() {
    this.modal.hide()
  }

  successMessage() {
    let title = 'Berjaya'
    let message = 'Informasi pengguna berjaya dikemas kini'
    this.notifyService.openToastr(title, message)
  }

  openSearch() {
    document.body.classList.add("g-navbar-search-showing");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-showing");
      document.body.classList.add("g-navbar-search-show");
    }, 150);
    setTimeout(function () {
      document.body.classList.add("g-navbar-search-shown");
    }, 300);
  }

  closeSearch() {
    document.body.classList.remove("g-navbar-search-shown");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-show");
      document.body.classList.add("g-navbar-search-hiding");
    }, 150);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hiding");
      document.body.classList.add("g-navbar-search-hidden");
    }, 300);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hidden");
    }, 500);
  }

}