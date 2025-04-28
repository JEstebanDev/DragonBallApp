export interface Character {
  id: string;
  name: string;
  ki: string;
  race: string;
  image: string;
  affiliation: string;
}

export interface CharacterList {
  characters: Character[];
}
