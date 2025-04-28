import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, OnChanges {
  @Input() characterId!: string;
  characterForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      ki: ['', Validators.required],
      race: ['', Validators.required],
      image: ['', Validators.required],
      affiliation: ['', Validators.required],
    });
  }

  getCharacterById() {
    if (this.characterId) {
      this.apiService
        .getCharacterById(this.characterId)
        .pipe(
          tap((response) => {
            this.characterForm.patchValue(response);
            console.log('Character loaded successfully', response);
          }),
          catchError((error) => {
            console.error('Error loading character', error);
            return of(null);
          })
        )
        .subscribe();
    }
  }

  ngOnInit() {
    if (this.characterId) {
      this.getCharacterById();
    }
  }
  ngOnChanges() {
    if (this.characterId) {
      this.getCharacterById();
    } else {
      this.characterForm.reset();
    }
  }

  onSubmit() {
    if (this.characterId) {
      this.updateCharacter();
      this.characterId = '';
    } else {
      this.createCharacter();
    }
    this.characterForm.reset();
  }

  createCharacter() {
    if (this.characterForm.valid) {
      this.apiService
        .createCharacter(this.characterForm.value)
        .pipe(
          tap((response) => {
            console.log('Character created successfully', response);
            this.characterForm.reset();
          }),
          catchError((error) => {
            console.error('Error creating character', error);
            return of(null);
          })
        )
        .subscribe();
    } else {
      console.error('Form is invalid');
    }
  }

  updateCharacter() {
    this.apiService
      .updateCharacter(this.characterId, this.characterForm.value)
      .pipe(
        tap((response) => {
          console.log('Character updated successfully', response);
          this.characterForm.reset();
        }),
        catchError((error) => {
          console.error('Error updating character', error);
          return of(null);
        })
      )
      .subscribe();
  }
}
