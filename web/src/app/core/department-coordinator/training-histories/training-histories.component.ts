import { AuthService } from './../../../shared/services/auth/auth.service';
import { UsersService } from './../../../shared/services/users/users.service';
import { AbsenceMemosService } from './../../../shared/services/absence-memos/absence-memos.service';
import { AttendancesService } from 'src/app/shared/services/attendances/attendances.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


import { ApplicationDepartmentExtended } from 'src/app/shared/services/applications/applications.model';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import * as moment from 'moment';
import * as xlsx from 'xlsx';
import { forkJoin } from 'rxjs';
import { Section } from 'src/app/shared/code/user';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-training-histories',
  templateUrl: './training-histories.component.html',
  styleUrls: ['./training-histories.component.scss']
})
export class TrainingHistoriesComponent implements OnInit {

  // Data
  applications: ApplicationDepartmentExtended[] = []
  sections = Section

  kehadiranForm: FormGroup
  kehadiranData
  absenceMemo
  absenceMemoId
  data
  UserID
  verifiedBy

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  // Table
  tableEntries: number = 5
  tableSelected: any[] = []
  tableTemp = []
  tableActiveRow: any
  tableRows: any = []
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  SelectionType = SelectionType;

  // Checker
  isEmpty: boolean = true
  isSummaryTableHidden: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  constructor(
    private applicationService: ApplicationsService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private absenceMemosService: AbsenceMemosService,
    private attendancesService: AttendancesService,
    private usersService: UsersService,
    private authService: AuthService
  ) { 
    this.getData()
    this.getCurrentUser()
  }

  ngOnInit() {
    this.kehadiranForm = this.formBuilder.group({
      id: new FormControl(""),
      email: new FormControl(""),
    });
  }

  getData() {
    this.loadingBar.start()
    forkJoin([
      this.applicationService.getDepartmentCoordinatorHistories()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
        this.applications = this.applicationService.applicationsDepartment
        this.tableRows = this.applications
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.tableTemp = this.tableRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
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

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == 'name') {
      console.log("filter table",this.tableTemp)
      this.tableTemp = this.tableRows.filter(function(d) {
        return d.training.title.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'organiser_type') {
      if (val == 'aa') {
        this.tableTemp = this.tableRows
      }
      else {
        this.tableTemp = this.tableRows.filter(function(d) {
          return d.organiser_type.toLowerCase().indexOf(val) !== -1 || !val;
        });
      }
    }
    else if (type == 'year') {
      if (val == 'aa') {
        this.tableTemp = this.tableRows
      }
      else {
        this.tableTemp = this.tableRows.filter(function(d) {
          return d.start_date_year.toLowerCase().indexOf(val) !== -1 || !val;
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

  view(selected) {
    let path = '/dc/trainings/information'
    let extras = selected['training']['id']
    let queryParams = {
      queryParams: {
        id: extras
      }
    }
    this.router.navigate([path], queryParams)
  }

  exportExcel() {
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileName = 'Ringkasan_Permohonan_Latihan_Jabatan_' + todayDateFormat + '.xlsx'
    let element = document.getElementById('summaryTable'); 
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, fileName);
  }

  openModal(modalRef: TemplateRef<any>, process: string, row) {
    if (process === 'kehadiran'){
      console.log("loop template")
      console.log('row applicant id', row.applicant?.full_name)
      console.log('row applicant id', row.applicant?.id)
      console.log('row training id', row.training?.id)
      this.data = 'training='+ row.training?.id + '&attendee=' + row.applicant?.id

      this.attendancesService.filter(this.data).subscribe(
        (res)=>{
          console.log('TT', res.length)
          if (res.length == 0){
            this.kehadiranData = 'Tiada Rekod'
          }
          else{
            if (res[0]['is_attend'] == false){
              this.kehadiranData = 'Tidak Hadir'
            }
            else if (res[0]['is_attend'] == true){
              this.kehadiranData = 'Hadir'
            }
          }
        },
        (err)=>{},
      )

      this.absenceMemosService.filter(this.data).subscribe(
        (res)=>{
          console.log('TT TT', res)
          if (res.length == 0){
            this.absenceMemo = 'Tiada Rekod'
            this.verifiedBy = 'Belum Disahkan'
          }
          else if(res.length == 1){
            this.absenceMemo = res[0]['reason']
            this.verifiedBy = res[0]['verified_by_id']
          }
        },
        (err)=>{},
      )

      this.kehadiranForm.patchValue({
        ...row,
      });
    }

    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
  }

  getCurrentUser() {
    this.authService.getDetailByToken().subscribe(
      () => {
        this.UserID = this.authService.userDetail
      },
      () => {
        this.UserID = this.authService.userDetail
      },
      () => {
        console.log('id', this.UserID.id)
      }
    )
  }

  verifyAbsence() {
    console.log('useful id', this.data)
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Permohonan sedang diterima'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    // this.data = 'id=ba9dae95-5297-44f8-8838-c216de25ad3c'
    this.absenceMemosService.filter(this.data).subscribe(
      (res)=>{
        console.log('update absence id', res)
        if(res.length == 1){
          this.absenceMemoId = res[0]['id']
          console.log('update absence id', this.absenceMemoId)

          this.applicationService.verifiedMemo(this.absenceMemoId).subscribe(
            () => {
              this.loadingBar.complete()
              let successTitle = 'Berjaya'
              let successMessage = 'Permohonan berjaya diterima'
              this.notifyService.openToastr(successTitle, successMessage)
            },
            (err) => {
              this.loadingBar.complete()
              let failedTitle = 'Tidak Berjaya'
              let failedMessage = 'Permohonan tidak berjaya diterima. Sila cuba sekali lagi'
              this.notifyService.openToastrError(failedTitle, failedMessage)
            },
            () => {}
          )
          // this.absenceMemosService.update(this.absenceMemoId,){}
        }
      },
      (err)=>{},
    )
  }

}
