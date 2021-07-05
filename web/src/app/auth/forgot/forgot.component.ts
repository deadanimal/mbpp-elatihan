import { UsersService } from './../../shared/services/users/users.service';
import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { NotifyService } from "src/app/shared/handler/notify/notify.service";
import { SecurityService } from "src/app/shared/services/security/security.service";
import Swal from "sweetalert2";
import { ViewChild } from "@angular/core";
import { CustomValidators } from "src/app/shared/validators/custom/custom-validators";
import { User } from 'src/app/shared/services/users/users.model';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';


@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.component.html",
  styleUrls: ["./forgot.component.scss"],
})
export class ForgotComponent implements OnInit {
  // Image
  imgLogo = "assets/img/logo/mbpp-logo.png";

  @ViewChild("SecurityQuestion") modalRef: any;
  @ViewChild("ResetPassword") modalRef2: any;

  // Form
  users: User[] = []
  selectedUser: User

  focusEmail;
  currentDate: Date = new Date();
  userDetail = [];
  answerDetail = [];
  questionDetail = [];
  SecurityQuestionForm: FormGroup;
  resetForm: FormGroup;
  passwordForm: FormGroup;
  loginFormMessages = {
    username: [{ type: "required", message: "NRIC diperlukan" }],
  };

  resetFormMessages = {
    email: [
      { type: "required", message: "Email is required" },
      { type: "email", message: "Please enter a valid email" },
    ],
  };

  passwordFormMessages = {
    new_password1: [
      { type: "required", message: "Kata laluan diperlukan" },
      {
        type: "minlength",
        message: "Kata laluan mesti mengandungi sekurang-kurangnya 8 aksara",
      },
      {
        type: "hasNumber",
        message: "Kata laluan mesti mengandungi sekurang-kurangnya 1 digit",
      },
      // { type: 'hasCapitalCase', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 1 huruf besar' },
      // { type: 'hasSmallCase', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 1 huruf kecil' }
    ],
    new_password2: [
      { type: "required", message: "Ulang kata laluan diperlukan" },
      { type: "NoPassswordMatch", message: "Kata laluan tidak sepadan" },
    ],
  };

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered",
  };

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private router: Router,
    private modalService: BsModalService,
    private securityService: SecurityService,
    private organisationsService:OrganisationsService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.passwordForm = this.formBuilder.group(
      {
        new_password1: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true,
            }),
            // CustomValidators.patternValidator(/[A-Z]/, {
            //   hasCapitalCase: true
            // }),
            // // check whether the entered password has a lower case letter
            // CustomValidators.patternValidator(/[a-z]/, {
            //   hasSmallCase: true
            // })
          ])
        ),
        new_password2: new FormControl(
          null,
          Validators.compose([Validators.required])
        ),
      },
      { validator: CustomValidators.passwordMatchValidator }
    );

    this.resetForm = this.formBuilder.group({
      username: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
    });

    this.SecurityQuestionForm = this.formBuilder.group({
      id: new FormControl(""),
      question: new FormControl(""),
      answer: new FormControl(""),
    });
  }

  reset() {
    this.loadingBar.start();
    this.loadingBar.complete();
    this.successMessage();
  }

  // token(){
  //   this.authService.obtainToken(this.resetForm.value).subscribe(
  //     (res)=>{
  //       console.log("dalam refresh token ")
  //     }
  //   )
  // }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  openModal2(modalRef2: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef2, this.modalConfig);
  }

  closeModal() {
    this.modal.hide();
    this.resetForm.reset();
    this.SecurityQuestionForm.reset();
    this.resetForm.reset();
  }

  closeModal2() {
    this.modal.hide();
  }

  reset_password() {
    if (this.resetForm.value.username == null){
      this.NoInputMessage()
    }
    else {
      let id = "username=" + this.resetForm.value.username;
      console.log("ic = ",this.resetForm.value.username)
      // let reset = this.resetForm.value.username
      // this.organisationsService.sendingResetEmail(reset).subscribe(
      //   (res) => {
      //     console.log(res)
      //   },
      //   (err) => {
      //     console.log(err)
      //   }
      // )
      this.userService.filter(id).subscribe(
        (res) => {
          this.userDetail = res
          console.log(this.userDetail[0].id)
          if (this.userDetail == undefined) {
            this.NoInputMessage()
          }
          else {
            this.openModal(this.modalRef)
          } 
        },
        (err) => {
          console.log("error", err);
        },
        () => {
          this.GetSecurityAnswer();
        }
      );
    }
  }

  GetSecurityAnswer() {
    let answerID = "user_id=" + this.userDetail[0].id;
    console.log(answerID);
    this.securityService.filterAnswer(answerID).subscribe(
      (res) => {
        this.answerDetail = res;
        // console.log(this.answerDetail[0].answer);
      },
      (err) => {
        console.log("error", err);
      },
      () => {
        this.GetSecurityQuestion();
      }
    );
  }

  CompareAnswerGiven() {
    if (
      this.SecurityQuestionForm.value.answer.toLowerCase() ===
      this.answerDetail[0].answer.toLowerCase()
    ) {
      console.log("correct answer");
      this.closeModal();
      this.openModal2(this.modalRef2);
    } else {
      this.errorMessage();
      this.closeModal();
    }
  }

  GetSecurityQuestion() {
    let questionID = "id=" + this.answerDetail[0].question;
    this.securityService.filterQuestion(questionID).subscribe((res) => {
      this.questionDetail = res;
      this.SecurityQuestionForm.patchValue(res);
      // console.log(this.questionDetail[0].question);
    });
  }

  changePasswordNew() {
    console.log(this.userDetail[0].id)
    console.log(this.passwordForm.value)
    this.userService.changePassword(this.userDetail[0].id, this.passwordForm.value['new_password1']).subscribe(
      (res)=> {
        console.log(res)
      }
    )
    // this.successChangePassword()
    this.closeModal()
  }

  // changePassword() {
  //   this.loadingBar.start();
  //   console.log(this.passwordForm.value);
  //   this.authService.changePassword(this.passwordForm.value).subscribe(
  //     () => {
  //       this.loadingBar.complete();
  //     },
  //     () => {
  //       this.loadingBar.complete();
  //       let title = "Ralat";
  //       let message =
  //         "Kata laluan tidak berjaya dikemaskini. Sila cuba sekali lagi";
  //       this.notifyService.openToastrError(title, message);
  //     },
  //     () => {
  //       let title = "Berjaya";
  //       let message =
  //         "Kata laluan berjaya dikemaskini. Sila log masuk semula menggunakan kata laluan baru";
  //       this.notifyService.openToastr(title, message);
  //       this.closeModal2();
  //       this.navigatePage("/auth/login");
  //     }
  //   );
  // }

  navigatePage(path: string) {
    return this.router.navigate([path]);
  }

  successMessage() {
    let title = "Success";
    let message = "A reset link has been sent to your email";
    this.notifyService.openToastr(title, message);
  }

  errorMessage() {
    Swal.fire({
      title: "Oops...",
      text: "Sila masukkan jawapan yang betul!",
      type: "error",
      timer: 3000,
    });
  }

  NoInputMessage() {
    Swal.fire({
      title: "Oops...",
      text: "Sila masukkan NRIC yang betul!",
      type: "error",
      timer: 3000,
    });
  }
  
}
