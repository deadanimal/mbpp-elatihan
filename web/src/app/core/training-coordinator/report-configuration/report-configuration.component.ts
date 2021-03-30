import { Component, NgZone, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { Level } from 'src/app/shared/services/levels/levels.model';
import { LevelsService } from 'src/app/shared/services/levels/levels.service';
import { Plan } from 'src/app/shared/services/plans/plans.model';
import { PlansService } from 'src/app/shared/services/plans/plans.service';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-report-configuration',
  templateUrl: './report-configuration.component.html',
  styleUrls: ['./report-configuration.component.scss']
})
export class ReportConfigurationComponent implements OnInit {

  // Data
  levels: Level[] = []
  plans: Plan[] = []
  levelSelected
  planSelected

  // Form
  levelForm: FormGroup
  planForm: FormGroup

  // Table
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  SelectionType = SelectionType;

  tableLevelEntries: number = 5
  tableLevelSelected: any[] = []
  tableLevelTemp = []
  tableLevelActiveRow: any
  tableLevelRows: any = []

  tablePlanEntries: number = 5
  tablePlanSelected: any[] = []
  tablePlanTemp = []
  tablePlanActiveRow: any
  tablePlanRows: any = []

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  // Checker
  isLevelEmpty: boolean = true
  isPlanEmpty: boolean = true
  isSummaryTableHidden: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Subscriber
  subscription: Subscription

  constructor(
    private levelService: LevelsService,
    private planService: PlansService,
    private fb: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    private notifyService: NotifyService,
    private zone: NgZone
  ) { 
    this.getData()
  }

  ngOnInit() {
    this.initForm()
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  getData() {
    this.loadingBar.start()
    this.subscription = forkJoin([
      this.levelService.getAll(),
      this.planService.getAll()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.levels = this.levelService.levels
        this.plans = this.planService.plans

        this.tableLevelRows = this.levels
        this.tableLevelTemp = this.tableLevelRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableLevelTemp.length >= 1) {
          this.isLevelEmpty = false
        }
        else {
          this.isLevelEmpty = true
        }

        this.tablePlanRows = this.plans
        this.tablePlanTemp = this.tablePlanRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tablePlanTemp.length >= 1) {
          this.isPlanEmpty = false
        }
        else {
          this.isPlanEmpty = true
        }
      }
    )
  }
  
  initForm() {
    this.planForm = this.fb.group({
      q1: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      q2: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      q3: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      q4: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      year: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    this.levelForm = this.fb.group({
      year: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      level: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })
  }

  entriesChange($event, type) {
    if (type == 'level') {
      this.tableLevelEntries = $event.target.value;
    }
    else if (type == 'plan') {
      this.tablePlanEntries = $event.target.value;
    }
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == 'level') {
      this.tableLevelTemp = this.tableLevelRows.filter(function(d) {
        return d.year.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'plan') {
      this.tablePlanTemp = this.tablePlanRows.filter(function(d) {
        return d.year.toLowerCase().indexOf(val) !== -1 || !val;
      });
    } 
  }

  onSelect({ selected }, type) {
    if (type == 'level') {
      this.tableLevelSelected.splice(0, this.tableLevelSelected.length);
      this.tableLevelSelected.push(...selected);
    }
    else if (type == 'plan') {
      this.tablePlanSelected.splice(0, this.tablePlanSelected.length);
      this.tablePlanSelected.push(...selected);
    }
  }

  onActivate(event, type) {
    if (type == 'level') {
      this.tableLevelActiveRow = event.row;
    }
    else if (type == 'plan') {
      this.tablePlanActiveRow = event.row;
    }
  }

  openModalAdd(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  openModalPatch(modalRef: TemplateRef<any>, row, type) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);

    if (type == 'plan') {
      this.planForm.controls['year'].setValue(row['year'])
      this.planForm.controls['q1'].setValue(row['q1'])
      this.planForm.controls['q2'].setValue(row['q2'])
      this.planForm.controls['q3'].setValue(row['q3'])
      this.planForm.controls['q4'].setValue(row['q4'])
      this.planSelected = row
    }
    else if (type == 'level') {
      this.levelForm.controls['year'].setValue(row['year'])
      this.levelForm.controls['level'].setValue(row['level'])
      this.levelSelected = row
    }
  }

  closeModal(type) {
    if (type == 'plan') {
      this.planForm.controls['year'].patchValue(null)
      this.planForm.controls['q1'].patchValue(0)
      this.planForm.controls['q2'].patchValue(0)
      this.planForm.controls['q3'].patchValue(0)
      this.planForm.controls['q4'].patchValue(0)
    }
    else if (type == 'level') {
      this.levelForm.controls['year'].patchValue(null)
      this.levelForm.controls['level'].patchValue(0)
    }
    this.modal.hide()
  }

  addPlan() {
    // console.log('masuk')
    this.loadingBar.start()
    this.planService.post(this.planForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Pelan pemantauan berjaya ditambah.'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk menambah pelan pemantauan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.closeModal('plan')
        this.planForm.reset()
        this.initForm()
        this.getData()
      }
    )
  }

  patchPlan() {
    this.loadingBar.start()
    this.planService.patch(this.planSelected['id'], this.planForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Pelan pemantauan berjaya dikemaskini'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Pelan pemantauan tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        delete this.planSelected
        this.closeModal('plan')
        this.planForm.reset()
        this.initForm()
        this.getData()
      }
    )
  }

  addLevel() {
    // console.log('masuk')
    this.loadingBar.start()
    this.levelService.post(this.levelForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Pelan pemantauan berjaya ditambah.'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk menambah pelan pemantauan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.closeModal('level')
        this.levelForm.reset()
        this.initForm()
        this.getData()
      }
    )
  }

  patchLevel() {
    this.loadingBar.start()
    this.levelService.patch(this.levelSelected['id'], this.levelForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Pelan pemantauan berjaya dikemaskini'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Pelan pemantauan tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        delete this.planSelected
        this.closeModal('level')
        this.levelForm.reset()
        this.initForm()
        this.getData()
      }
    )
  }

}
