import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { forkJoin, Subscription } from "rxjs";
import { environment } from "src/environments/environment";

import {
  Department,
  Section,
  ServiceStatus,
  UserType,
} from "src/app/shared/code/user";
import {
  ContentExtended,
  ExternalExtended,
  InternalExtended,
} from "src/app/shared/services/evaluations/evaluations.model";
import { EvaluationsService } from "src/app/shared/services/evaluations/evaluations.service";
import { TrainingsService } from "src/app/shared/services/trainings/trainings.service";
import { NotifyService } from "src/app/shared/handler/notify/notify.service";

import * as moment from "moment";
import * as xlsx from "xlsx";
import swal from "sweetalert2";

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: "app-evaluations",
  templateUrl: "./evaluations.component.html",
  styleUrls: ["./evaluations.component.scss"],
})
export class EvaluationsComponent implements OnInit {
  // Data
  contents: ContentExtended[] = [];
  externals: ExternalExtended[] = [];
  internals: InternalExtended[] = [];
  trainings;
  externalTrainings = [];
  internalTrainings = [];
  selectedExternalTraining;
  selectedInternalTraining;

  // Table
  tableMessages = {
    emptyMessage: "Tiada rekod dijumpai",
    totalMessage: "rekod",
  };
  SelectionType = SelectionType;

  tableExternalEntries: number = 5;
  tableExternalSelected: any[] = [];
  tableExternalTemp = [];
  tableExternalActiveRow: any;
  tableExternalRows: any = [];

  tableInternalEntries: number = 5;
  tableInternalSelected: any[] = [];
  tableInternalTemp = [];
  tableInternalActiveRow: any;
  tableInternalRows: any = [];

  // Checker
  isExternalEmpty: boolean = true;
  isInternalEmpty: boolean = true;

  // Icon
  iconEmpty = "assets/img/icons/box.svg";

  // Subscription
  subscription: Subscription;

  constructor(
    private evaluationService: EvaluationsService,
    private trainingService: TrainingsService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private router: Router
  ) {
    this.getData();
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getData() {
    this.loadingBar.start();
    this.subscription = forkJoin([
      this.evaluationService.getExternals(),
      this.evaluationService.getInternals(),
      this.trainingService.getAll(),
    ]).subscribe(
      () => {
        this.loadingBar.complete();
      },
      () => {
        this.loadingBar.complete();
      },
      () => {
        this.externals = this.evaluationService.externals;
        this.internals = this.evaluationService.internals;
        this.trainings = this.trainingService.trainings;

        this.trainings.forEach((obj) => {
          if (obj.organiser_type == "DD") {
            this.internalTrainings.push(obj);
          } else if (obj.organiser_type == "LL") {
            this.externalTrainings.push(obj);
          }
        });

        this.tableExternalRows = this.externals;
        this.tableExternalTemp = this.tableExternalRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key + 1,
          };
        });

        if (this.tableExternalTemp.length >= 1) {
          this.isExternalEmpty = false;
        } else {
          this.isExternalEmpty = true;
        }

        this.tableInternalRows = this.internals;
        this.tableInternalTemp = this.tableInternalRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key + 1,
          };
        });

        if (this.tableInternalTemp.length >= 1) {
          this.isInternalEmpty = false;
        } else {
          this.isInternalEmpty = true;
        }
      }
    );
  }

  entriesChange($event, type) {
    if (type == "external") {
      this.tableExternalEntries = $event.target.value;
    } else if (type == "internal") {
      this.tableInternalEntries = $event.target.value;
    }
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == "external") {
      this.tableExternalTemp = this.tableExternalRows.filter(function (d) {
        return d.training?.title.toLowerCase().indexOf(val) !== -1 || !val;
      });
    } else if (type == "internal") {
      this.tableInternalTemp = this.tableInternalRows.filter(function (d) {
        return d.training?.title.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
  }

  onSelect({ selected }, type) {
    if (type == "external") {
      this.tableExternalSelected.splice(0, this.tableExternalSelected.length);
      this.tableExternalSelected.push(...selected);
    } else if (type == "internal") {
      this.tableInternalSelected.splice(0, this.tableInternalSelected.length);
      this.tableInternalSelected.push(...selected);
    }
  }

  onActivate(event, type) {
    if (type == "external") {
      this.tableExternalActiveRow = event.row;
    } else if (type == "internal") {
      this.tableInternalActiveRow = event.row;
    }
  }

  view(selected, type) {
    let path = "/tc/evaluations/details";
    let extras = selected["id"];
    let queryParams = {
      queryParams: {
        id: extras,
        type: type,
      },
    };
    this.router.navigate([path], queryParams);
  }

  printEvaluation(trainingOrganiserType) {
    // Print internal evaluation as bulk
    if (trainingOrganiserType == "DD") {
      let body = {
        training: this.selectedInternalTraining,
      };
      this.evaluationService.generateBulkInternal(body).subscribe(
        (res) => {
          // console.log("res", res);
          this.downloadUrlasFile(res);
        },
        (err) => {
          console.error("err", err);
        }
      );
    } else if (trainingOrganiserType == "LL") {
      let body = {
        training: this.selectedExternalTraining,
      };
      this.evaluationService.generateBulkExternal(body).subscribe(
        (res) => {
          // console.log("res", res);
          this.downloadUrlasFile(res);
        },
        (err) => {
          console.error("err", err);
        }
      );
    }
  }

  downloadUrlasFile(res) {
    res.forEach((obj) => {
      let full_url = environment.baseUrl.slice(0, environment.baseUrl.length - 1) + obj.evaluation;
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.download = obj.evaluation.substr(obj.evaluation.lastIndexOf('/') + 1);
      a.target = '_blank';
      a.setAttribute('download', obj.evaluation.substr(obj.evaluation.lastIndexOf('/') + 1));
      a.setAttribute('style', 'display: none');
      a.href = full_url;
      a.click();
      a.remove();
    });
  }
}
