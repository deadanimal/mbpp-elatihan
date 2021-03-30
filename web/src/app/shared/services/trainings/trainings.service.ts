import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Training, TrainingExtended, TrainingType } from './trainings.model';
import { User } from '../users/users.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {

  // URL
  public urlTraining: string = environment.baseUrl + 'v1/trainings/'
  public urlTrainingType: string = environment.baseUrl + 'v1/training-types/'

  // Data
  training: Training
  trainings: Training[] = []
  trainingsFiltered: Training[] = []
  trainingExtended: TrainingExtended
  trainingsExtended: TrainingExtended[] = []
  trainingStatistics: any
  trainingNextCode: string
  trainingType: TrainingType
  trainingTypes: TrainingType[] = []

  applicableStaffs: User[] = []

  reportUrl: any
  evaluationRes: any

  constructor(
    private http: HttpClient
  ) { }

  post(body: any): Observable<Training> {
    // console.log('hello')
    return this.http.post<any>(this.urlTraining, body).pipe(
      tap((res) => {
        this.training = res
        // console.log('Training: ', this.training)
      })
    )
  }

  getAll(): Observable<Training[]> {
    return this.http.get<Training[]>(this.urlTraining).pipe(
      tap((res) => {
        this.trainings = res
        // console.log('Trainings: ', this.trainings)
      })
    )
  }

  getLatest(): Observable<Training[]> {
    let urlTemp = this.urlTraining + 'get_latest'
    return this.http.get<Training[]>(urlTemp).pipe(
      tap((res) => {
        this.trainings = res
        // console.log('Trainings: ', this.trainings)
      })
    )
  }

  getAllExtended(): Observable<TrainingExtended[]> {
    let urlTemp = this.urlTraining + 'extended_all'
    return this.http.get<TrainingExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.trainingsExtended = res
        // console.log('Trainings: ', this.trainingsExtended)
      })
    )
  }

  getDepartmentList(): Observable<TrainingExtended[]> {
    let urlTemp = this.urlTraining + 'get_department_list'
    return this.http.get<TrainingExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.trainingsExtended = res
        // console.log('Trainings: ', this.trainingsExtended)
      })
    )
  }

  getOne(id: String): Observable<TrainingExtended> {
    let urlTemp = this.urlTraining + id + '/extended'
    // console.log('URL ', urlTemp)
    return this.http.get<TrainingExtended>(urlTemp).pipe(
      tap((res) => {
        this.trainingExtended = res
        // console.log('Training: ', this.trainingExtended)
      })
    )
  }

  update(id: String, body: Form): Observable<Training> {
    let urlTemp = this.urlTraining + id + '/'
    return this.http.put<Training>(urlTemp, body).pipe(
      tap((res) => {
        this.training = res
        // console.log('Training', this.training)
      })
    )
  }

  filter(field: String): Observable<Training[]> {
    let urlTemp = this.urlTraining + '?' + field
    return this.http.get<Training[]>(urlTemp).pipe(
      tap((res) => {
        this.trainingsFiltered = res
        // console.log('Trainings', this.trainingsFiltered)
      })
    )
  }

  activate(id: string) {
    let urlTemp = this.urlTraining + id + '/activate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.training = res
        // console.log('Training: ', this.training)
      })
    )
  }

  deactivate(id: string) {
    let urlTemp = this.urlTraining + id + '/deactivate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.training = res
        // console.log('Training: ', this.training)
      })
    )
  }

  getStatistics() {
    let urlTemp = this.urlTraining + 'get_statistics'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.trainingStatistics = res
        // console.log('Statistics: ', this.trainingStatistics)
      })
    )
  }

  getStatisticsDepartment() {
    let urlTemp = this.urlTraining + 'get_statistics_department'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.trainingStatistics = res
        // console.log('Statistics: ', this.trainingStatistics)
      })
    )
  }

  getNextCode() {
    let urlTemp = this.urlTraining + 'get_next_code'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.trainingNextCode = res['code']
        // console.log(res)
      })
    )
  }

  checkEvaluation(id: string) {
    let urlTemp = this.urlTraining + id + '/check_evaluation'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.evaluationRes = res
        // console.log(res)
      })
    )
  }

  createTrainingType(body: Form): Observable<TrainingType> {
    return this.http.post<any>(this.urlTrainingType, body).pipe(
      tap((res) => {
        this.trainingType = res
        // console.log('Training type: ', this.trainingType)
      })
    )
  }

  getTrainingTypes(): Observable<TrainingType[]> {
    return this.http.get<TrainingType[]>(this.urlTrainingType).pipe(
      tap((res) => {
        this.trainingTypes = res
        // console.log('Training types: ', this.trainingTypes)
      })
    )
  }

  getTrainingType(id: String): Observable<TrainingType> {
    let urlTemp = this.urlTrainingType + id
    return this.http.get<TrainingType>(urlTemp).pipe(
      tap((res) => {
        this.trainingType = res
        // console.log('Training type: ', this.trainingType)
      })
    )
  }

  updateTrainingType(id: String, body: Form): Observable<TrainingType> {
    let urlTemp = this.urlTrainingType + id + '/'
    return this.http.put<TrainingType>(urlTemp, body).pipe(
      tap((res) => {
        this.trainingType = res
        // console.log('Training type', this.trainingType)
      })
    )
  }
  
  getApplicableDepartment(id: string): Observable<User[]> {
    let urlTemp = this.urlTraining + id + '/get_applicable_staff_department'
    return this.http.get<User[]>(urlTemp).pipe(
      tap((res) => {
        this.applicableStaffs = res
        // console.log('Applicable staff in department', this.applicableStaffs)
      })
    )
  }

  getApplicableTraining(id: string): Observable<User[]> {
    let urlTemp = this.urlTraining + id + '/get_applicable_staff_training'
    return this.http.get<User[]>(urlTemp).pipe(
      tap((res) => {
        this.applicableStaffs = res
        // console.log('Applicable staff for training coordinator', this.applicableStaffs)
      })
    )
  }

  getReportAttendance(body: any) {
    let urlTemp = this.urlTraining + 'report_attendance/'
    return this.http.post<any>(urlTemp, body).pipe(
      tap((res) => {
        this.reportUrl = res
      })
    )
  }

  getReportOBB(body: any) {
    let urlTemp = this.urlTraining + 'report_obb/'
    return this.http.post<any>(urlTemp, body).pipe(
      tap((res) => {
        this.reportUrl = res
      })
    )
  }

}
