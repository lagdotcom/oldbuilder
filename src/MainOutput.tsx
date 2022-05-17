import { filter } from "fuzzy";
import { useMemo } from "react";
import Box from "ui-box";

import Card, { Categorised } from "./Card";
import cardsDb from "./cards.json";
import CardsOutput from "./CardsOutput";
import categories from "./categories";
import StatsOutput from "./StatsOutput";

const allCards = cardsDb as unknown as Card[];

const basicLands = [
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

function splitLine(line: string): [count: number, name: string] {
  const i = line.indexOf(" ");
  if (i === -1) return [1, line];

  const first = line.substring(0, i);
  const count = parseInt(first, 10);
  if (isNaN(count)) return [1, line];
  return [count, line.substring(i + 1)];
}

const bannedCards = [
  // this is a preview from MMQ
  "Crossbow Infantry",

  // ante cards
  "Amulet of Quoz",
  "Bronze Tablet",
  "Darkpact",
  "Demonic Attorney",
  "Jeweled Bird",
  "Rebirth",
  "Tempest Efreet",
  "Timmerian Fiends",

  // 'dexterity' cards
  "Chaos Orb",
  "Falling Star",
];

type CardParseResult = {
  matches: Record<string, Categorised[]>;
  outOfRoom: Card[];
  banned: Card[];
  unknown: string[];
};

function parseCardsText(text: string): CardParseResult {
  const matches: Record<string, Categorised[]> = {};
  const outOfRoom: Card[] = [];
  const banned: Card[] = [];
  const unknown: string[] = [];

  categories.forEach((cat) => (matches[cat.name] = []));

  text
    .split("\n")
    .filter((x) => x)
    .forEach((n) => {
      const [count, name] = splitLine(n.trim());
      if (!name || name.substring(0, 2) === "//") return;

      const results = filter(name, allCards, { extract: (c) => c.name });
      if (results.length) {
        const c = results[0].original;

        if (bannedCards.includes(c.name)) {
          banned.push(c);
          return;
        }

        for (let i = 0; i < count; i++) {
          let found: Categorised | undefined = undefined;
          for (const cat of categories) {
            const m = matches[cat.name];
            if (cat.limit <= m.length) continue;
            if (
              cat.highlander &&
              !basicLands.includes(c.name) &&
              m.filter((mc) => mc.card === c).length
            )
              continue;

            const result = cat.get(c);
            if (result) {
              found = result;
              break;
            }
          }

          if (found) matches[found.category.name].push(found);
          else outOfRoom.push(c);
        }
      } else unknown.push(n);
    });

  return { matches, outOfRoom, banned, unknown };
}

type Props = { text: string; onShow(card: Card, set: string): void };
export default function MainOutput({ onShow, text }: Props) {
  const { matches, outOfRoom, banned, unknown } = useMemo(
    () => parseCardsText(text),
    [text]
  );

  return (
    <Box flex={1} display="flex" flexDirection="column" height="100vh" gap={8}>
      <StatsOutput cards={Object.values(matches).flat()} />
      <CardsOutput
        matches={matches}
        outOfRoom={outOfRoom}
        banned={banned}
        unknown={unknown}
        onShow={onShow}
      />
    </Box>
  );
}
