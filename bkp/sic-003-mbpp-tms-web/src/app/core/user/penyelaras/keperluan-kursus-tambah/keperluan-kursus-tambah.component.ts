import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TrainingNeedQuestionsService } from 'src/app/shared/services/training-need-questions/training-need-questions.service';
import { TrainingNeedAnswersService } from 'src/app/shared/services/training-need-answers/training-need-answers.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { TrainingNeedQuestion } from 'src/app/shared/services/training-need-questions/training-need-questions.model';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';

@Component({
  selector: 'app-keperluan-kursus-tambah',
  templateUrl: './keperluan-kursus-tambah.component.html',
  styleUrls: ['./keperluan-kursus-tambah.component.scss']
})
export class KeperluanKursusTambahComponent implements OnInit {

  // Form
  needForm: FormGroup
  needFormMessages = {
    'question': [
      { type: 'required', message: 'Anda perlu mengisi soalan' }
    ],
    'question_type': [
      { type: 'required', message: 'Anda perlu mengisi jenis soalan' }
    ]
  }

  questions: TrainingNeedQuestion[] = []

  constructor(
    private trainingNeedQuestion: TrainingNeedQuestionsService,
    private trainingNeedAnswer: TrainingNeedAnswersService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService
    ) { 
      this.questions = this.trainingNeedQuestion.questions
    }

  ngOnInit() {
    this.needForm = this.formBuilder.group({
      question: new FormControl('', Validators.compose([
        Validators.required
      ])),
      question_type: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }

  submit() {
    this.loadingBar.start()
    this.trainingNeedQuestion.create(this.needForm.value).subscribe(
      () => {
        this.successMessage()
        this.loadingBar.complete()
      },
      () => {
        this.unsuccessMessage()
        this.loadingBar.complete()
      },
      () => {
        this.refresh()
      }
    )
  }

  refresh() {
    this.trainingNeedQuestion.get().subscribe(
      () => {

      },
      () => {

      },
      () => {
        this.questions = this.trainingNeedQuestion.questions
      }
    )
  }

  successMessage() {
    let title = 'Berjaya'
    let message = 'Soalan keperluan kursus telah ditambah'
    this.notifyService.openToastr(title, message)
  }

  unsuccessMessage() {
    let title = 'Tidak berjaya'
    let message = 'Sila cuba sekali lagi'
    this.notifyService.openToastrHttp(title, message)
  }
}
