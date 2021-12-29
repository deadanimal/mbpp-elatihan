import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { forkJoin, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import {
  ExternalExtended,
  InternalExtended,
} from "src/app/shared/services/evaluations/evaluations.model";
import { EvaluationsService } from "src/app/shared/services/evaluations/evaluations.service";

@Component({
  selector: "app-evaluation-details",
  templateUrl: "./evaluation-details.component.html",
  styleUrls: ["./evaluation-details.component.scss"],
})
export class EvaluationDetailsComponent implements OnInit {
  // Data
  evaluationID;
  evaluationType;
  TraningName
  internal: InternalExtended;
  external: ExternalExtended;

  // Form
  externalForm: FormGroup;
  internalForm: FormGroup;
  contentForm: FormGroup;
  contentFormArray: FormArray;

  // Checker
  isEvaluated: boolean = false;
  isInternal: boolean = false;
  isExternal: boolean = false;

  // Subscriber
  subscription: Subscription;

  // URL Download
  generateInternalReportURL = environment.baseUrl + "v1/internal-evaluations/";
  generateExternalReportURL = environment.baseUrl + "v1/external-evaluations/";

  constructor(
    private authService: AuthService,
    private evaluationService: EvaluationsService,
    private loadingBar: LoadingBarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trainingsService:TrainingsService,
  ) {
    this.evaluationID = this.route.snapshot.queryParamMap.get("id");
    this.evaluationType = this.route.snapshot.queryParamMap.get("type");
    // console.log('Training ID', this.trainingID)
    if (!this.evaluationID) {
      this.router.navigate(["/tc/evaluations"]);
    }

    if (
      this.evaluationID &&
      (typeof this.evaluationID === "string" ||
        this.evaluationID instanceof String)
    ) {
      this.getData();
      this.initForm();
    } else {
      this.navigatePage("/tc/evaluations");
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initForm() {
    this.externalForm = this.fb.group({
      training: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      attendee: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_1: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_2: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_3: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_4: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_5: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_6: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_7: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_8: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_9: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
    });

    this.internalForm = this.fb.group({
      training: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      attendee: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_1: new FormControl("3", Validators.compose([Validators.required])),
      answer_2: new FormControl("2", Validators.compose([Validators.required])),
      answer_3: new FormControl("2", Validators.compose([Validators.required])),
      answer_4: new FormControl("3", Validators.compose([Validators.required])),
      answer_5: new FormControl("3", Validators.compose([Validators.required])),
      answer_6: new FormControl("3", Validators.compose([Validators.required])),
      answer_7: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_8: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      answer_9: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
    });

    this.contentForm = this.fb.group({
      contentFormArray: this.fb.array([this.initContentForm()]),
    });
  }

  initContentForm() {
    return this.fb.group({
      evaluation: new FormControl(
        this.evaluationID,
        Validators.compose([Validators.required])
      ),
      topic_trainer: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      content: new FormControl("3", Validators.compose([Validators.required])),
      presentation: new FormControl(
        "3",
        Validators.compose([Validators.required])
      ),
      relevance: new FormControl(
        "3",
        Validators.compose([Validators.required])
      ),
    });
  }

  addContent() {
    this.contentFormArray = this.contentForm.get(
      "contentFormArray"
    ) as FormArray;
    this.contentFormArray.push(this.initContentForm());
  }

  removeContent(ind: number) {
    this.contentFormArray.removeAt(ind);
  }

  getData() {
    this.loadingBar.start();
    this.TraningName = null
    if (this.evaluationType == "DD") {
      this.subscription = forkJoin([
        this.evaluationService.getInternal(this.evaluationID),
      ]).subscribe(
        (res) => {
          this.loadingBar.complete();
          // console.log("res", res[0]);

          // Checker
          this.isEvaluated = true;

          this.internalForm.controls["training"].patchValue(res[0].training.id);
          this.TraningName=res[0].training.title
          this.internalForm.controls["attendee"].patchValue(
            this.authService.userID
          );

          this.internal = res[0];

          if (this.isEvaluated) {
            this.internalForm.controls["answer_1"].patchValue(
              this.internal["answer_1"]
            );
            this.internalForm.controls["answer_2"].patchValue(
              this.internal["answer_2"]
            );
            this.internalForm.controls["answer_3"].patchValue(
              this.internal["answer_3"]
            );
            this.internalForm.controls["answer_4"].patchValue(
              this.internal["answer_4"]
            );
            this.internalForm.controls["answer_5"].patchValue(
              this.internal["answer_5"]
            );
            this.internalForm.controls["answer_6"].patchValue(
              this.internal["answer_6"]
            );
            this.internalForm.controls["answer_7"].patchValue(
              this.internal["answer_7"]
            );
            this.internalForm.controls["answer_8"].patchValue(
              this.internal["answer_8"]
            );
            this.internalForm.controls["answer_9"].patchValue(
              this.internal["answer_9"]
            );
            this.internalForm.controls["answer_1"].disable();
            this.internalForm.controls["answer_2"].disable();
            this.internalForm.controls["answer_3"].disable();
            this.internalForm.controls["answer_4"].disable();
            this.internalForm.controls["answer_5"].disable();
            this.internalForm.controls["answer_6"].disable();
            this.internalForm.controls["answer_7"].disable();
            this.internalForm.controls["answer_8"].disable();
            this.internalForm.controls["answer_9"].disable();
          }
        },
        (err) => {
          this.loadingBar.complete();
          // console.error("err", err);
        }
      );
    } else if (this.evaluationType == "LL") {
      this.subscription = forkJoin([
        this.evaluationService.getExternal(this.evaluationID),
      ]).subscribe(
        (res) => {
          this.loadingBar.complete();
          // console.log("res", res[0]);

          // Checker
          this.isEvaluated = true;

          this.externalForm.controls["training"].patchValue(res[0].training.id);
          this.TraningName=res[0].training.title
          this.externalForm.controls["attendee"].patchValue(
            this.authService.userID
          );

          this.external = res[0];

          if (this.isEvaluated) {
            this.externalForm.controls["answer_1"].patchValue(
              this.external["answer_1"]
            );
            this.externalForm.controls["answer_2"].patchValue(
              this.external["answer_2"]
            );
            this.externalForm.controls["answer_3"].patchValue(
              this.external["answer_3"]
            );
            this.externalForm.controls["answer_4"].patchValue(
              this.external["answer_4"]
            );
            this.externalForm.controls["answer_5"].patchValue(
              this.external["answer_5"]
            );
            this.externalForm.controls["answer_6"].patchValue(
              this.external["answer_6"]
            );
            this.externalForm.controls["answer_7"].patchValue(
              this.external["answer_7"]
            );
            this.externalForm.controls["answer_8"].patchValue(
              this.external["answer_8"]
            );
            this.externalForm.controls["answer_9"].patchValue(
              this.external["answer_9"]
            );
            this.externalForm.controls["answer_1"].disable();
            this.externalForm.controls["answer_2"].disable();
            this.externalForm.controls["answer_3"].disable();
            this.externalForm.controls["answer_4"].disable();
            this.externalForm.controls["answer_5"].disable();
            this.externalForm.controls["answer_6"].disable();
            this.externalForm.controls["answer_7"].disable();
            this.externalForm.controls["answer_8"].disable();
            this.externalForm.controls["answer_9"].disable();
          }
        },
        (err) => {
          this.loadingBar.complete();
          // console.error("err", err);
        }
      );
    }
  }

  approve() {
    this.loadingBar.start();
    if (this.evaluationType == "DD") {
      this.evaluationService.approveInternal(this.evaluationID).subscribe(
        () => {
          this.loadingBar.complete();
        },
        () => {
          this.loadingBar.complete();
        },
        () => {}
      );
    } else if (this.evaluationType == "LL") {
      this.evaluationService.approveExternal(this.evaluationID).subscribe(
        () => {
          this.loadingBar.complete();
        },
        () => {
          this.loadingBar.complete();
        },
        () => {}
      );
    } else {
      this.loadingBar.complete();
    }
  }

  verify() {
    this.loadingBar.start();
    if (this.evaluationType == "DD") {
      this.evaluationService.verifyInternal(this.evaluationID).subscribe(
        () => {
          this.loadingBar.complete();
        },
        () => {
          this.loadingBar.complete();
        },
        () => {}
      );
    } else if (this.evaluationType == "LL") {
      this.evaluationService.verifyExternal(this.evaluationID).subscribe(
        () => {
          this.loadingBar.complete();
        },
        () => {
          this.loadingBar.complete();
        },
        () => {}
      );
    } else {
      this.loadingBar.complete();
    }
  }

  navigatePage(path) {
    return this.router.navigate([path]);
  }
}
