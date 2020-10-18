import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/shared/services/notes/notes.service';
import { Training } from 'src/app/shared/services/trainings/trainings.model';
import { Note } from 'src/app/shared/services/notes/notes.model';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.scss']
})
export class TrainingDetailComponent implements OnInit {

  // Data
  training: Training
  notes: Note[] = []

  // Checker
  isNotesEmpty: boolean = true

  constructor(
    private noteService: NotesService,
    private loadingBar: LoadingBarService
  ) { }

  ngOnInit() {
  }

  getData() {
    let filterField = 'training=' + this.training.id
    this.loadingBar.start()
    this.noteService.filter(filterField).subscribe(
      () => {
        this.loadingBar.complete()
        this.notes = this.noteService.notesFiltered
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        if (this.notes.length >= 1) {
          this.isNotesEmpty = false
        }
        else {
          this.isNotesEmpty = true
        }
      }
    )
  }

}
