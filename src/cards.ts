import Card from "./Card";
import cardsDb from "./cards.json";

export const allCards = cardsDb as unknown as Card[];

export const basicLands = [
  "Plains",
  "Island",
  "Swamp",
  "Mountain",
  "Forest",
  "Snow-Covered Plains",
  "Snow-Covered Island",
  "Snow-Covered Swamp",
  "Snow-Covered Mountain",
  "Snow-Covered Forest",
];
