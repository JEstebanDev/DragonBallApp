import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Character } from '../interfaces/character.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://wu9qxj7k68.execute-api.us-east-1.amazonaws.com';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  characterCreated = new EventEmitter<Character>();

  constructor(private http: HttpClient) {}

  createCharacter(characterData: Character): Observable<Character> {
    return this.http.post<Character>(
      this.apiUrl.concat('/createCharacter'),
      characterData,
      { headers: this.headers }
    ).pipe(
      tap((response: Character) => {
        this.characterCreated.emit(response);
      })
    );
  }

  getCharacters(): Observable<any> {
    return this.http.get(this.apiUrl.concat('/getCharacters'), {
      headers: this.headers,
    });
  }

  getCharacterById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl.concat('/getCharacter')}`, {
      headers: this.headers,
      params: { id: id },
    });
  }

  updateCharacter(id: string, characterData: any): Observable<Character> {
    return this.http.put<Character>(
      `${this.apiUrl.concat('/updateCharacter')}`,
      characterData,
      {
        headers: this.headers,
        params: { id: id },
      }
    ).pipe(
      tap((response: Character) => {
        this.characterCreated.emit(response);
      })
    );
  }

  deleteCharacter(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl.concat('/removeCharacter')}`, {
      headers: this.headers,
      params: { id: id },
    });
  }
}
