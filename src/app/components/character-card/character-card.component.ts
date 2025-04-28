import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from 'src/app/interfaces/character.model';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.css']
})
export class CharacterCardComponent {
  @Input() character!: Character;

  @Output() editCharacter = new EventEmitter<string>();
  @Output() deleteCharacter = new EventEmitter<string>();

  onEditCharacter(id: string): void {
    this.editCharacter.emit(id);
  }
  onDeleteCharacter(id: string): void {
    this.deleteCharacter.emit(id);
  }

}
