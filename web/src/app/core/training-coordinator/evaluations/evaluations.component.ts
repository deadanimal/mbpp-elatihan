import { Component, OnInit } from '@angular/core';

import { Department, Section, ServiceStatus, UserType } from 'src/app/shared/code/user';
import swal from 'sweetalert2';
import * as moment from 'moment';
import * as xlsx from 'xlsx';
import { ContentExtended, ExternalExtended, InternalExtended } from 'src/app/shared/services/evaluations/evaluations.model';
import { EvaluationsService } from 'src/app/shared/services/evaluations/evaluations.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { forkJoin, Subscription } from 'rxjs';
import { Router } from '@angular/router';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.scss']
})
export class EvaluationsComponent implements OnInit {

  // Data
  contents: ContentExtended[] = []
  externals: ExternalExtended[] = []
  internals: InternalExtended[] = []

  // Table
  tableMessages = {
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  SelectionType = SelectionType;

  tableExternalEntries: number = 5
  tableExternalSelected: any[] = []
  tableExternalTemp = []
  tableExternalActiveRow: any
  tableExternalRows: any = []

  tableInternalEntries: number = 5
  tableInternalSelected: any[] = []
  tableInternalTemp = []
  tableInternalActiveRow: any
  tableInternalRows: any = []
  
  // Checker
  isExternalEmpty: boolean = true
  isInternalEmpty: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Subscription
  subscription: Subscription

  constructor(
    private evaluationService: EvaluationsService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private router: Router
  ) { 
    this.getData()
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  getData() {
    this.loadingBar.start()
    this.subscription = forkJoin([
      this.evaluationService.getExternals(),
      this.evaluationService.getInternals()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.externals = this.evaluationService.externals
        this.internals = this.evaluationService.internals

        this.tableExternalRows = this.externals
        this.tableExternalTemp = this.tableExternalRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableExternalTemp.length >= 1) {
          this.isExternalEmpty = false
        }
        else {
          this.isExternalEmpty = true
        }

        this.tableInternalRows = this.internals
        this.tableInternalTemp = this.tableInternalRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableInternalTemp.length >= 1) {
          this.isInternalEmpty = false
        }
        else {
          this.isInternalEmpty = true
        }
      }
    )
  }

  entriesChange($event, type) {
    if (type == 'external') {
      this.tableExternalEntries = $event.target.value;
    }
    else if (type == 'internal') {
      this.tableInternalEntries = $event.target.value;
    }
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == 'external') {
      this.tableExternalTemp = this.tableExternalRows.filter(function(d) {
        return d.training?.title.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'internal') {
      this.tableInternalTemp = this.tableInternalRows.filter(function(d) {
        return d.training?.title.toLowerCase().indexOf(val) !== -1 || !val;
      });
    } 
  }

  onSelect({ selected }, type) {
    if (type == 'external') {
      this.tableExternalSelected.splice(0, this.tableExternalSelected.length);
      this.tableExternalSelected.push(...selected);
    }
    else if (type == 'internal') {
      this.tableInternalSelected.splice(0, this.tableInternalSelected.length);
      this.tableInternalSelected.push(...selected);
    }
  }

  onActivate(event, type) {
    if (type == 'external') {
      this.tableExternalActiveRow = event.row;
    }
    else if (type == 'internal') {
      this.tableInternalActiveRow = event.row;
    }
  }

  view(selected, type) {
    let path = '/tc/evaluations/details'
    let extras = selected['id']
    let queryParams = {
      queryParams: {
        id: extras,
        type: type
      }
    }
    this.router.navigate([path], queryParams)
  }

}
