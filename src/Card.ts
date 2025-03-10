interface Card {
  name: string;
  type: string;
  colour: string[];
  mana?: string;
  produced_mana?: string[];
  sets: Record<string, string[]>;
}
export default Card;

export interface Category {
  name: string;
  title?: string;
  limit: number;
  highlander?: boolean;
  get(card: Card): Categorised | undefined;
}

export interface Categorised {
  category: Category;
  set: string;
  card: Card;
}
