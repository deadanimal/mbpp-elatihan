import { Component, OnInit } from '@angular/core';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-training-add',
  templateUrl: './training-add.component.html',
  styleUrls: ['./training-add.component.scss']
})
export class TrainingAddComponent implements OnInit {

  // Form
  trainingForm: FormGroup

  constructor(
    private authService: AuthService,
    private trainingService: TrainingsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.trainingForm = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required
      ])),
      start_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      end_date: new FormControl('', Validators.compose([
        Validators.required
      ]))
      
    })
  }

}
