import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { Core } from 'src/app/shared/services/cores/cores.model';
import { CoresService } from 'src/app/shared/services/cores/cores.service';
import { Domain } from 'src/app/shared/services/domains/domains.model';
import { DomainsService } from 'src/app/shared/services/domains/domains.service';
import { Organisation } from 'src/app/shared/services/organisations/organisations.model';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';
import { Trainer } from 'src/app/shared/services/trainers/trainers.model';
import { TrainersService } from 'src/app/shared/services/trainers/trainers.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  // Data
  cores: Core[] = []
  domains: Domain[] = []
  organisations: Organisation[] = []
  trainers: Trainer[] = []
  coreSelected
  domainSelected
  organisationSelected

  // Table
  SelectionType = SelectionType;
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  // Cores
  tableCoreEntries: number = 5
  tableCoreSelected: any[] = []
  tableCoreTemp = []
  tableCoreActiveRow: any
  tableCoreRows: any = []
  // Domains
  tableDomainEntries: number = 5
  tableDomainSelected: any[] = []
  tableDomainTemp = []
  tableDomainActiveRow: any
  tableDomainRows: any = []
  // Organisations
  tableOrganisationEntries: number = 5
  tableOrganisationSelected: any[] = []
  tableOrganisationTemp = []
  tableOrganisationActiveRow: any
  tableOrganisationRows: any = []
  // Trainers
  tableTrainerEntries: number = 5
  tableTrainerSelected: any[] = []
  tableTrainerTemp = []
  tableTrainerActiveRow: any
  tableTrainerRows: any = []
  
  // Checker
  isCoreEmpty: boolean = true
  isDomainEmpty: boolean = true
  isOrganisationEmpty: boolean = true
  isTrainerEmpty: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  // Form
  coreForm: FormGroup
  domainForm: FormGroup
  organisationForm: FormGroup
  trainerForm: FormGroup

  // Choices
  coreChoices = [
    { value: 'GN', text: 'Generik' },
    { value: 'FN', text: 'Fungsional' }
  ]
  trainerChoices = [
    { value: 'SP', text: 'Penceramah' },
    { value: 'FC', text: 'Fasilitator' }
  ]


  constructor(
    private coreService: CoresService,
    private domainService: DomainsService,
    private organisationService: OrganisationsService,
    private trainerService: TrainersService,
    private fb: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    private notifyService: NotifyService
  ) { 
    this.getData()
  }

  ngOnInit() {
    this.initForm()
  }

  getData() {
    this.loadingBar.start()
    forkJoin([
      this.coreService.getAll(),
      this.domainService.getDomains(),
      this.organisationService.getAll(),
      this.trainerService.getTrainers()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.cores = this.coreService.cores
        this.domains = this.domainService.domains
        this.organisations = this.organisationService.organisations
        this.trainers = this.trainerService.trainers

        this.tableCoreRows = this.cores
        this.tableCoreTemp = this.tableCoreRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableCoreTemp.length >= 1) {
          this.isCoreEmpty = false
        }
        else {
          this.isCoreEmpty = true
        }

        this.tableDomainRows = this.domains
        this.tableDomainTemp = this.tableDomainRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableDomainTemp.length >= 1) {
          this.isDomainEmpty = false
        }
        else {
          this.isDomainEmpty = true
        }

        this.tableOrganisationRows = this.organisations
        this.tableOrganisationTemp = this.tableOrganisationRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableOrganisationTemp.length >= 1) {
          this.isOrganisationEmpty = false
        }
        else {
          this.isOrganisationEmpty = true
        }

        this.tableTrainerRows = this.trainers
        this.tableTrainerTemp = this.tableTrainerRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableTrainerTemp.length >= 1) {
          this.isTrainerEmpty = false
        }
        else {
          this.isTrainerEmpty = true
        }
      }
    )
  }

  initForm() {
    this.coreForm = this.fb.group({
      parent: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      child: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    this.domainForm = this.fb.group({
      name: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    this.organisationForm = this.fb.group({
      name: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      shortname: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    this.trainerForm = this.fb.group({
      name: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      phone: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      training: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      trainer_type: new FormControl('SP', Validators.compose([
        Validators.required
      ]))
    })
  }

  openModalAdd(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  openModalPatch(modalRef: TemplateRef<any>, row, type) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);

    if (type == 'cores') {
      this.coreForm.controls['parent'].setValue(row['parent'])
      this.coreForm.controls['child'].setValue(row['child'])
      this.coreSelected = row
    }
    else if (type == 'domains') {
      this.domainForm.controls['name'].setValue(row['name'])
      this.domainSelected = row
    }
    else if (type == 'organisations') {
      this.organisationForm.controls['name'].setValue(row['name'])
      this.organisationForm.controls['shortname'].setValue(row['shortname'])
      this.organisationSelected = row
    }
  }

  closeModal(type) {
    if (type == 'core') {
      this.coreForm.controls['parent'].patchValue(null)
      this.coreForm.controls['child'].patchValue(null)
    }
    else if (type == 'domain') {
      this.domainForm.controls['name'].patchValue(null)
    }
    else if (type == 'organisation') {
      this.organisationForm.controls['name'].patchValue(null)
      this.organisationForm.controls['shortname'].patchValue(null)
    }
    this.modal.hide()
    // this.organisationForm.reset()
  }

  entriesChange($event, type) {
    if (type == 'cores') {
      this.tableCoreEntries = $event.target.value;
    }
    else if (type == 'domains') {
      this.tableDomainEntries = $event.target.value;
    }
    else if (type == 'cores') {
      this.tableCoreEntries = $event.target.value;
    }
    else if (type == 'cores') {
      this.tableCoreEntries = $event.target.value;
    }
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == 'cores') {
      this.tableCoreTemp = this.tableCoreRows.filter(function(d) {
        return d.child.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'domains') {
      this.tableDomainTemp = this.tableDomainRows.filter(function(d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'organisations') {
      this.tableOrganisationTemp = this.tableOrganisationRows.filter(function(d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'trainers') {
      this.tableTrainerTemp = this.tableTrainerRows.filter(function(d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
  }

  onSelect({ selected }, type) {
    if (type == 'cores') {
      this.tableCoreSelected.splice(0, this.tableCoreSelected.length);
      this.tableCoreSelected.push(...selected);
    }
    else if (type == 'domains') {
      this.tableDomainSelected.splice(0, this.tableDomainSelected.length);
      this.tableDomainSelected.push(...selected);
    }
    else if (type == 'organisations') {
      this.tableOrganisationSelected.splice(0, this.tableOrganisationSelected.length);
      this.tableOrganisationSelected.push(...selected);
    }
    else if (type == 'trainers') {
      this.tableTrainerSelected.splice(0, this.tableTrainerSelected.length);
      this.tableTrainerSelected.push(...selected);
    }
  }

  onActivate(event, type) {
    if (type == 'cores') {
      this.tableCoreActiveRow = event.row;
    }
    else if (type == 'domains') {
      this.tableDomainActiveRow = event.row;
    }
    else if (type == 'organisations') {
      this.tableOrganisationActiveRow = event.row;
    }
    else if (type == 'trainers') {
      this.tableTrainerActiveRow = event.row;
    }
  }

  addCore() {
    this.loadingBar.start()
    this.coreService.post(this.coreForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Teras berjaya ditambah'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Teras tidak berjaya ditambah. Sila cuba sekali lagi'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.closeModal('core')
        this.getData()
      }
    )
  }

  patchCore() {
    this.loadingBar.start()
    this.coreService.update(this.coreSelected['id'], this.coreForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Teras berjaya dikemaskini'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Teras tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        delete this.coreSelected
        this.closeModal('core')
        this.getData()
      }
    )
  }

  addDomain() {
    this.loadingBar.start()
    this.domainService.create(this.domainForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Domain berjaya ditambah'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Domain tidak berjaya ditambah. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.closeModal('domain')
        this.getData()
      }
    )
  }

  patchDomain() {
    this.loadingBar.start()
    this.domainService.update(this.domainSelected['id'], this.domainForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Domain berjaya dikemaskini'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Domain tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        delete this.domainSelected
        this.closeModal('domain')
        this.getData()
      }
    )
  }

  addOrganisation() {
    this.loadingBar.start()
    this.organisationService.post(this.organisationForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Penganjur berjaya ditambah'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Penganjur tidak berjaya ditambah. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.closeModal('organisation')
        this.getData()
      }
    )
  }

  patchOrganisation() {
    this.loadingBar.start()
    this.organisationService.update(this.organisationSelected['id'], this.organisationForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Penganjur berjaya dikemaskini'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Penganjur tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        delete this.organisationSelected
        this.closeModal('organisation')
        this.getData()
      }
    )
  }

}
