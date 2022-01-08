import { filter } from "fuzzy";
import { useMemo } from "react";
import Box from "ui-box";

import Card, { Categorised, Category } from "./Card";
import CardInfo from "./CardInfo";
import cardsDb from "./cards.json";

const allCards = cardsDb as unknown as Card[];

function splitLine(line: string): [count: number, name: string] {
  const i = line.indexOf(" ");
  if (i === -1) return [1, line];

  const first = line.substring(0, i);
  const count = parseInt(first, 10);
  if (isNaN(count)) return [1, line];
  return [count, line.substring(i + 1)];
}

const fourth: Category = {
  name: "4th Edition",
  limit: 10,
  get(card) {
    if (card.sets["4ed"]) return { category: fourth, set: "4ed", card };
  },
};
const mirage: Category = {
  name: "Mirage/Visions",
  limit: 10,
  get(card) {
    if (card.sets["mir"]) return { category: mirage, set: "mir", card };
    if (card.sets["vis"]) return { category: mirage, set: "vis", card };
  },
};
const ice: Category = {
  name: "Ice Age/Alliances",
  limit: 10,
  get(card) {
    if (card.sets["ice"]) return { category: ice, set: "ice", card };
    if (card.sets["all"]) return { category: ice, set: "all", card };
  },
};
const fallen: Category = {
  name: "Fallen Empires/Homelands",
  limit: 5,
  get(card) {
    if (card.sets["fem"]) return { category: fallen, set: "fem", card };
    if (card.sets["hml"]) return { category: fallen, set: "hml", card };
  },
};

const ancientSets = [
  "lea",
  "leb",
  "2ed",
  "3ed",
  "arn",
  "atq",
  "leg",
  "drk",
  "chr",
];
const ancient: Category = {
  name: "Ancient Sets",
  limit: 10,
  get(card) {
    for (const set of ancientSets) {
      if (card.sets[set]) return { category: ancient, set, card };
    }
  },
};

const wildcardSets = [
  "4ed",
  "ice",
  "all",
  "fem",
  "hml",
  "mir",
  "vis",
  "lea",
  "leb",
  "2ed",
  "3ed",
  "arn",
  "atq",
  "leg",
  "drk",
  "chr",
  "wth",
  "tmp",
  "sth",
  "usg",
  "ulg",
  "uds",
  "por",
  "p02",
  "ptk",
  "phpr",
  "5ed",
  "6ed",
  "7ed",
  "dkm",
];
const wildcard: Category = {
  name: "Wildcard Highlander",
  limit: 15,
  highlander: true,
  get(card) {
    for (const set of wildcardSets) {
      if (card.sets[set]) return { category: wildcard, set, card };
    }
  },
};

const categories = [fourth, ice, fallen, mirage, ancient, wildcard];

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
      const [count, name] = splitLine(n);
      if (!name || name.substring(0, 2) === "//") return;

      const results = filter(name, allCards, { extract: (c) => c.name });
      if (results.length) {
        const c = results[0].original;

        for (let i = 0; i < count; i++) {
          let found: Categorised | undefined = undefined;
          for (const cat of categories) {
            const m = matches[cat.name];
            if (cat.limit <= m.length) continue;
            if (cat.highlander && m.filter((mc) => mc.card === c).length)
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
export default function CardsOutput({ onShow, text }: Props) {
  const [matches, unmatched] = useMemo(() => parseCardsText(text), [text]);

  return (
    <Box flex={1} display="flex" flexDirection="column" flexWrap="wrap" gap={8}>
      {Object.entries(matches).map(([name, cards]) => (
        <Box key={name}>
          <Box fontWeight="bold">{name}</Box>
          {cards.map((card, n) => (
            <CardInfo key={n} card={card} onShow={onShow} />
          ))}
        </Box>
      ))}

      {unmatched.length > 0 && (
        <Box>
          <Box fontWeight="bold">Errors</Box>
          {unmatched.map((name, n) => (
            <Box key={n}>{name}</Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
