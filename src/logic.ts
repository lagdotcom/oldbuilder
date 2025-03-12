import { filter } from "fuzzy";

import Card, { Categorised } from "./Card";
import {
  allCards,
  bannedCards,
  basicLands,
  expandedVanillaCreatures,
  restrictedCards,
} from "./cards";
import categories from "./categories";

function splitLine(line: string): [count: number, name: string] {
  const i = line.indexOf(" ");
  if (i === -1) return [1, line];

  const first = line.substring(0, i);
  const count = parseInt(first, 10);
  if (isNaN(count)) return [1, line];
  return [count, line.substring(i + 1)];
}

export interface CardParseResult {
  count: number;
  matches: Record<string, Categorised[]>;
  outOfRoom: Card[];
  banned: Card[];
  overflow: Card[];
  unknown: string[];
  errors: string[];
}

export function parseCardsText(text: string): CardParseResult {
  const counted: Record<string, number> = {};
  const matches: Record<string, Categorised[]> = Object.fromEntries(
    categories.map((cat) => [cat.name, []]),
  );
  const outOfRoom: Card[] = [];
  const banned: Card[] = [];
  const overflow: Card[] = [];
  const unknown: string[] = [];
  const errors: string[] = [];
  let count = 0;

  text
    .split("\n")
    .filter((x) => x)
    .forEach((n) => {
      const [amount, name] = splitLine(n.trim());
      if (!name || name.substring(0, 2) === "//") return;

      const results = filter(name, allCards, { extract: (c) => c.name });
      if (results.length) {
        const c = results[0].original;

        if (bannedCards.includes(c.name)) {
          banned.push(c);
          return;
        }

        const isBasic = basicLands.includes(c.name);
        const isRestricted = restrictedCards.includes(c.name);

        for (let i = 0; i < amount; i++) {
          count++;

          let isOverflow = false;
          let found: Categorised | undefined = undefined;
          for (const cat of categories) {
            const m = matches[cat.name];

            const limit = isRestricted ? 1 : isBasic ? Infinity : 4;
            if ((counted[c.name] || 0) + 1 > limit) {
              isOverflow = true;
              continue;
            }
            if (cat.limit <= m.length) continue;

            if (
              cat.highlander &&
              !isBasic &&
              m.filter((mc) => mc.card === c).length
            )
              continue;

            const result = cat.get(c);
            if (result) {
              found = result;
              break;
            }
          }

          if (found) {
            matches[found.category.name].push(found);
            counted[c.name] = (counted[c.name] || 0) + 1;
          } else if (isOverflow) {
            overflow.push(c);
          } else outOfRoom.push(c);
        }
      } else unknown.push(n);
    });

  let found = false;
  for (const [name, amount] of Object.entries(counted)) {
    if (expandedVanillaCreatures.includes(name) && amount >= 4) {
      found = true;
      break;
    }
  }
  if (!found)
    errors.push(
      "You must have at least 4 copies of a vanilla creature in your deck.",
    );

  return { count, matches, outOfRoom, banned, overflow, unknown, errors };
}
