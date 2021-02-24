import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';

import { User } from 'src/app/shared/services/users/users.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

import { Department, Section, ServiceStatus } from 'src/app/shared/code/user';

import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // Data
  user: any
  departments = Department
  sections = Section
  serviceStatus = ServiceStatus

  constructor(
    private authService: AuthService,
    private loadingBar: LoadingBarService,
    private router: Router
  ) { 
    this.getData()
  }

  ngOnInit() {
  }

  getData() {
    this.loadingBar.start()
    this.authService.getDetailByToken().subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.user = this.authService.userDetail
        this.user['department'] = ''
        this.user['section'] = ''
        this.user['age'] = 0
        this.user['role'] = 'KAKITANGAN'

        this.departments.forEach(
          (department) => {
            if (this.user['department_code'] == department['value']) {
              this.user['department'] = department['text']
            }
          }
        )

        this.sections.forEach(
          (section) => {
            if (this.user['section_code'] == section['value']) {
              this.user['section'] = section['text']
            }
          }
        )

        this.serviceStatus.forEach(
          (status) => {
            if (this.user['service_status'] == status['value']) {
              this.user['service_status'] = status['text']
            }
          }
        )

        let firstTwoNRIC = this.user['nric'].substring(0,2);
        if (Number(firstTwoNRIC) >= 40) {
          let genYear = 1900 + Number(firstTwoNRIC)
          this.user['age'] = moment().year() - genYear
        }
        else {
          let genYear = 2000 + Number(firstTwoNRIC)
          this.user['age'] = moment().year() - genYear
        }

        if (this.user['user_type'] == 'DC') {
          this.user['role'] = 'PENYELARAS JABATAN'
        }
        else if (this.user['user_type'] == 'TC') {
          this.user['role'] = 'PENYELARAS LATIHAN'
        }
        else if (this.user['user_type'] == 'DH') {
          this.user['role'] = 'KETUA JABATAN'
        }
        else if (this.user['user_type'] == 'AD') {
          this.user['role'] = 'PENTADBIR SISTEM'
        }
        else {
          this.user['role'] = 'KAKITANGAN'
        }
      }
    )
  }

  navigatePage(path: String) {
    return this.router.navigate([path])
  }

}
