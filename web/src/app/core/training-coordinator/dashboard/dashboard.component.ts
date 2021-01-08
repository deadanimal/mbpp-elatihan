import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { AttendancesService } from 'src/app/shared/services/attendances/attendances.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin } from 'rxjs';
import { Training } from 'src/app/shared/services/trainings/trainings.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Stats
  totalTrainingPlanned: number = 0
  totalTrainingInternal: number = 0
  totalTrainingExternal: number = 0
  totalBudgetCurrent: number = 0
  totalAttendanceInternal: number = 0
  totalAttendanceExternal: number = 0
  totalExpensesCurrent: number = 0

  constructor(
    private authService: AuthService,
    private examService: ExamsService,
    private attendanceService: AttendancesService,
    private trainingService: TrainingsService,
    private userService: UsersService,
    private loadingBar: LoadingBarService
  ) { }

  ngOnInit() {
  }

  getData() {
    forkJoin([
      this.attendanceService.getAll(),
      this.examService.getAll(),
      this.trainingService.getAll(),
      this.userService.getAll()
    ]).subscribe(
      () => {}
    )
  }

  calculateStats() {
    this.totalTrainingPlanned = 0 //
    this.totalTrainingInternal = 0 //
    this.totalTrainingExternal = 0 //
    this.totalBudgetCurrent = 0 
    this.totalAttendanceInternal = 0
    this.totalAttendanceExternal = 0
    this.totalExpensesCurrent = 0 //
    
    this.totalTrainingPlanned = this.trainingService.trainings.length

    this.trainingService.trainings.forEach(
      (training: Training) => {
        this.totalExpensesCurrent += training.cost

        if (training.organiser_type == 'DD') {
          this.totalTrainingInternal += 1
        }
        else if (training.organiser_type == 'LL') {
          this.totalTrainingExternal += 1
        }
      }
    )
  }

}
