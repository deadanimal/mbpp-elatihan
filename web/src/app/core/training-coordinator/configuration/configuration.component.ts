import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { Certification } from 'src/app/shared/services/configurations/certifications.model';
import { Configuration } from 'src/app/shared/services/configurations/configurations.model';
import { ConfigurationsService } from 'src/app/shared/services/configurations/configurations.service';
import { Core } from 'src/app/shared/services/cores/cores.model';
import { CoresService } from 'src/app/shared/services/cores/cores.service';
import { Domain } from 'src/app/shared/services/domains/domains.model';
import { DomainsService } from 'src/app/shared/services/domains/domains.service';
import { Exam } from 'src/app/shared/services/exams/exams.model';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { Organisation } from 'src/app/shared/services/organisations/organisations.model';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';
import { Trainer } from 'src/app/shared/services/trainers/trainers.model';
import { TrainersService } from 'src/app/shared/services/trainers/trainers.service';
import { TrainingType } from 'src/app/shared/services/trainings/trainings.model';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';

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
  trainingTypes: TrainingType[] = []
  coreSelected
  domainSelected
  organisationSelected
  typeSelected
  configuration: Configuration
  certification: Certification
  exams: Exam[] = []
  examSelected

  // Table
  SelectionType = SelectionType;
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  // Types
  tableTypeEntries: number = 5
  tableTypeSelected: any[] = []
  tableTypeTemp = []
  tableTypeActiveRow: any
  tableTypeRows: any = []
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
  // Exams
  tableExamEntries: number = 5
  tableExamSelected: any[] = []
  tableExamTemp = []
  tableExamActiveRow: any
  tableExamRows: any = []
  
  // Checker
  isTypeEmpty: boolean = true
  isCoreEmpty: boolean = true
  isDomainEmpty: boolean = true
  isOrganisationEmpty: boolean = true
  isTrainerEmpty: boolean = true
  isExamEmpty: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  // Form
  typeForm: FormGroup
  coreForm: FormGroup
  domainForm: FormGroup
  organisationForm: FormGroup
  trainerForm: FormGroup
  examForm: FormGroup
  configurationForm: FormGroup
  certificationForm: FormGroup
  dataSU
  nameSU

  // Choices
  coreChoices = [
    { value: 'GN', text: 'Generik' },
    { value: 'FN', text: 'Fungsional' }
  ]
  trainerChoices = [
    { value: 'SP', text: 'Penceramah' },
    { value: 'FC', text: 'Fasilitator' }
  ]
  examChoices = [
    { text: 'FAEDAH KEWANGAN', value: 'FKW' },
    { text: 'PENGESAHAN DALAM PERKHIDMATAN', value: 'PDP' },
    { text: 'PEPERIKSAAN PENINGKATAN SECARA LANTIKAN (PSL)', value: 'PSL' }
  ]


  constructor(
    private coreService: CoresService,
    private configurationService: ConfigurationsService,
    private domainService: DomainsService,
    private examService: ExamsService,
    private organisationService: OrganisationsService,
    private trainerService: TrainersService,
    private trainingService: TrainingsService,
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
      this.trainerService.getTrainers(),
      this.trainingService.getTrainingTypes(),
      this.configurationService.getAll(),
      this.examService.getExamList(),
      this.configurationService.getAllCert()
    ]).subscribe(
      (res) => {
        this.loadingBar.complete()
        this.dataSU = res[7]
        console.log('1',this.dataSU)
        this.nameSU = this.dataSU[0].value
        console.log('2',this.nameSU)
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.cores = this.coreService.cores
        this.domains = this.domainService.domains
        this.organisations = this.organisationService.organisations
        this.trainers = this.trainerService.trainers
        this.trainingTypes = this.trainingService.trainingTypes
        this.exams = this.examService.exams

        this.tableTypeRows = this.trainingTypes
        this.tableTypeTemp = this.tableTypeRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableTypeTemp.length >= 1) {
          this.isTypeEmpty = false
        }
        else {
          this.isTypeEmpty = true
        }

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

        this.tableExamRows = this.exams
        this.tableExamTemp = this.tableExamRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableExamTemp.length >= 1) {
          this.isExamEmpty = false
        }
        else {
          this.isExamEmpty = true
        }

        this.configurationService.configurations.forEach(
          (configuration: Configuration) => {
            if (configuration['slug'] == 'current_budget') {
              this.configuration = configuration
              this.configurationForm.controls['value'].setValue(this.configuration['value'])
            }
          }
        )

        this.configurationService.certifications.forEach(
          (certification: Certification) => {
            if (certification['name'] == 'Setiausaha Bandaraya') {
              this.certification = certification
              console.log(certification)
              this.certificationForm.controls['value'].setValue(this.certification['value'])
            }
          }
        )
        console.log(this.certification)
      }
    )
  }

  initForm() {
    this.typeForm = this.fb.group({
      name: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      active: new FormControl(true, Validators.compose([
        Validators.required
      ]))
    })

    this.coreForm = this.fb.group({
      parent: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      child: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      active: new FormControl(true, Validators.compose([
        Validators.required
      ]))
    })

    this.domainForm = this.fb.group({
      name: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      active: new FormControl(true, Validators.compose([
        Validators.required
      ]))
    })

    this.organisationForm = this.fb.group({
      name: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      shortname: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      active: new FormControl(true, Validators.compose([
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

    this.examForm = this.fb.group({
      title: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      code: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      classification: new FormControl('FKW', Validators.compose([
        Validators.required
      ])),
      organiser: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      active: new FormControl(true, Validators.compose([
        Validators.required
      ]))
    })

    this.configurationForm = this.fb.group({
      value: new FormControl(0, Validators.compose([
        Validators.required
      ]))
    })

    this.certificationForm = this.fb.group({
      value: new FormControl(0, Validators.compose([
        Validators.required
      ]))
    })
  }

  openModalAdd(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  openModalPatch(modalRef: TemplateRef<any>, row, type) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);

    if (type == 'types') {
      this.typeForm.controls['name'].setValue(row['name'])
      this.typeSelected = row
    }
    else if (type == 'cores') {
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
    else if (type == 'configurations') {
      this.configurationForm.controls['value'].setValue(row['value'])
    }
    else if (type == 'certifications') {
      this.certificationForm.controls['value'].setValue(row['value'])
    }
    else if (type == 'exams') {
      this.examForm.controls['title'].setValue(row['title'])
      this.examForm.controls['code'].setValue(row['code'])
      this.examForm.controls['classification'].setValue(row['classification'])
      this.examForm.controls['organiser'].setValue(row['organiser'])
      this.examForm.controls['active'].setValue(row['active'])
      this.examSelected = row
    }
  }

  closeModal(type) {
    if (type == 'types') {
      this.typeForm.controls['name'].patchValue(null)
    }
    else if (type == 'cores') {
      this.coreForm.controls['parent'].patchValue(null)
      this.coreForm.controls['child'].patchValue(null)
    }
    else if (type == 'domains') {
      this.domainForm.controls['name'].patchValue(null)
    }
    else if (type == 'organisations') {
      this.organisationForm.controls['name'].patchValue(null)
      this.organisationForm.controls['shortname'].patchValue(null)
    }
    else if (type == 'configurations') {
      this.configurationForm.controls['value'].patchValue(0)
    }
    else if (type == 'exams') {
      this.examForm.controls['title'].patchValue(null)
      this.examForm.controls['code'].patchValue(null)
      this.examForm.controls['classification'].patchValue('FKW')
      this.examForm.controls['organiser'].patchValue(null)
      this.examForm.controls['active'].patchValue(true)
    }
    else if (type == 'certifications') {
      this.certificationForm.controls['value'].patchValue(null)
    }
    this.modal.hide()
    // this.organisationForm.reset()
  }

  entriesChange($event, type) {
    if (type == 'types') {
      this.tableTypeEntries = $event.target.value;
    }
    else if (type == 'cores') {
      this.tableCoreEntries = $event.target.value;
    }
    else if (type == 'domains') {
      this.tableDomainEntries = $event.target.value;
    }
    else if (type == 'organisations') {
      this.tableOrganisationEntries = $event.target.value;
    }
    else if (type == 'trainers') {
      this.tableTrainerEntries = $event.target.value;
    }
    else if (type == 'exams') {
      this.tableExamEntries = $event.target.value;
    }
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == 'types') {
      this.tableTypeTemp = this.tableTypeRows.filter(function(d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'cores') {
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
    else if (type == 'exams') {
      this.tableExamTemp = this.tableExamRows.filter(function(d) {
        return d.title.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
  }

  onSelect({ selected }, type) {
    if (type == 'types') {
      this.tableTypeSelected.splice(0, this.tableTypeSelected.length);
      this.tableTypeSelected.push(...selected);
    }
    else if (type == 'cores') {
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
    else if (type == 'exams') {
      this.tableExamSelected.splice(0, this.tableExamSelected.length);
      this.tableExamSelected.push(...selected);
    }
  }

  onActivate(event, type) {
    if (type == 'types') {
      this.tableTypeActiveRow = event.row;
    }
    else if (type == 'cores') {
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
    else if (type == 'exams') {
      this.tableExamActiveRow = event.row;
    }
  }

  addType() {
    // console.log('masuk')
    this.loadingBar.start()
    this.trainingService.createTrainingType(this.typeForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Jenis latihan berjaya ditambah.'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk menambah jenis latihan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.getData()
        this.closeModal('types')
      }
    )
  }

  patchType() {
    this.loadingBar.start()
    this.trainingService.updateTrainingType(this.typeSelected['id'], this.typeForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Jenis latihan berjaya dikemaskini'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Jenis latihan tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        delete this.typeSelected
        this.closeModal('types')
        this.getData()
      }
    )
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
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.closeModal('cores')
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
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        delete this.coreSelected
        this.closeModal('cores')
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
        this.closeModal('domains')
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
        this.closeModal('domains')
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
        this.closeModal('organisations')
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
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        delete this.organisationSelected
        this.closeModal('organisations')
        this.getData()
      }
    )
  }

  patchConfiguration() {
    this.loadingBar.start()
    this.configurationService.update(this.configuration['id'], this.configurationForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Bajet semasa berjaya dikemaskini'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Bajet semasa tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.closeModal('configurations')
        this.getData()
      }
    )
  }

  patchCert() {
    this.loadingBar.start()
    this.configurationService.updateCert(this.certification['id'], this.certificationForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'SU semasa berjaya dikemaskini'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'SU semasa tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.closeModal('certifications')
        this.getData()
      }
    )
  }

  addExam() {
    this.loadingBar.start()
    this.examService.createExam(this.examForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Peperiksaan berjaya ditambah'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Peperiksaan tidak berjaya ditambah. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.closeModal('exams')
        this.getData()
      }
    )
  }

  patchExam() {
    this.loadingBar.start()
    this.examService.updateExam(this.examSelected['id'], this.examForm.value).subscribe(
      () => {
        let title = 'Berjaya'
        let message = 'Peperiksaan berjaya dikemaskini'
        this.notifyService.openToastr(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Peperiksaan tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        delete this.organisationSelected
        this.closeModal('exams')
        this.getData()
      }
    )
  }
}