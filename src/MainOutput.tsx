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

function parseCardsText(
  text: string
): [Record<string, Categorised[]>, string[]] {
  const matches: Record<string, Categorised[]> = {};
  const unmatched: string[] = [];

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
          else unmatched.push(`${c.name}: didn't fit anywhere`);
        }
      } else unmatched.push(`${n}: unknown card name`);
    });

  return [matches, unmatched];
}

type Props = { text: string; onShow(card: Categorised): void };
export default function MainOutput({ onShow, text }: Props) {
  const [matches, unmatched] = useMemo(() => parseCardsText(text), [text]);

  return (
    <Box flex={1} display="flex" flexDirection="column" height="100vh" gap={8}>
      <StatsOutput cards={Object.values(matches).flat()} />
      <CardsOutput matches={matches} unmatched={unmatched} onShow={onShow} />
    </Box>
  );
}
