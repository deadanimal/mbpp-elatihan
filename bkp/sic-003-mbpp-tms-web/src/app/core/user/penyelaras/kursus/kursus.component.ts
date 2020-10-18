import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { Training } from 'src/app/shared/services/trainings/trainings.model';

@Component({
	selector: 'app-kursus',
	templateUrl: './kursus.component.html',
	styleUrls: ['./kursus.component.scss']
})
export class KursusComponent implements OnInit {
	
	// Modal
	defaultModal: BsModalRef
	default = {
		keyboard: true,
		class: "modal-dialog-centered"
	}

	// Stepper
	isLinear = false
	isDisableRipple = true
	labelPosition = 'bottom'
	
	//Datepicker
	datePickerConfig = { 
		isAnimated: true, 
		containerClass: 'theme-blue' 
	}
	datePickerValue 

	//latest
	public tempAllTrainings: Training[] = []

	constructor(
		private modalService: BsModalService,
		private trainingService: TrainingsService
	) { 
		this.tempAllTrainings = this.trainingService.trainings
	}

	ngOnInit() {
		this.getAll()
	}

	doOpenModal(modalDefault: TemplateRef<any>) {
		this.defaultModal = this.modalService.show(modalDefault, this.default);
	}

	doAddNewTraining() {
		this.defaultModal.hide()
		setTimeout(() => {
			this.doDisplaySuccess()
		},500)
	}

	doDisplaySuccess() {
		swal.fire({
		  title: "Berjaya!",
		  text: "Kursus telah berjaya didaftarkan",
		  type: "success",
		  buttonsStyling: false,
		  confirmButtonClass: "btn btn-success"
		});
	}

	getAll(){
		//this.kursusService.retrieveKursus()
	}

}
