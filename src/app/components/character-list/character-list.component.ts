import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/interfaces/character.model';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  @Output() characterSelected = new EventEmitter<string>();
  characters: Character[] = [];
  private subscription: Subscription = new Subscription();
  private characterCreatedSubscription!: Subscription;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.characterCreatedSubscription = this.apiService.characterCreated.subscribe((newCharacter) => {
      this.getCharacters()
    });
    this.getCharacters();
  }

  getCharacters(){
    this.subscription.add(
      this.apiService.getCharacters().subscribe({
        next: (data) => {
          console.log('API Response:', data); // Debugging API response
          this.characters = data;
          console.log('Characters loaded:', this.characters);
        },
        error: (error) => {
          console.error('Error loading characters:', error);
        }
      })
    );
  }

  onEditCharacter(id: string): void {
    this.characterSelected.emit(id);
  }

  onDeleteCharacter(id: string): void {
    this.subscription.add(
      this.apiService.deleteCharacter(id).subscribe({
        next: () => {
          console.log('Character deleted:', id);
          this.characters = this.characters.filter(character => character.id !== id);
        },
        error: (error) => {
          console.error('Error deleting character:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.characterCreatedSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }
}
