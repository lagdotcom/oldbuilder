import { Category } from "./Card";
import { basicLands } from "./cards";

const makeCategory = (
  name: string,
  limit: number,
  sets: string[],
  {
    basics = false,
    highlander,
    title,
  }: { basics?: boolean; highlander?: boolean; title?: string } = {},
): Category => ({
  name,
  title,
  limit,
  highlander,
  get(card) {
    if (basicLands.includes(card.name) && !basics) return;

    for (const set of sets)
      if (card.sets[set]) return { category: this, set, card };
  },
});

const fourthSets = ["4ed"];
const fourth = makeCategory("Fourth Edition", 5, fourthSets);

const iceAgeSets = ["ice", "all"];
const iceAge = makeCategory("Ice Age Block", 5, iceAgeSets);

const mirageSets = ["mir", "vis", "wth"];
const mirage = makeCategory("Mirage Block", 5, mirageSets);

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
  "phpr",
];
const ancient = makeCategory("Ancient Sets", 5, ancientSets);

const fallenEmpireSets = ["fem", "hml"];
const fallenEmpire = makeCategory(
  "Fallen Empires / Homelands",
  5,
  fallenEmpireSets,
);

const normalSets = [
  ...fourthSets,
  ...iceAgeSets,
  ...mirageSets,
  ...ancientSets,
  ...fallenEmpireSets,
];
const normal = makeCategory("Any of the Above", 20, normalSets, {
  basics: true,
  title: "basics allowed",
});

const wildcardSets = [
  ...normalSets,
  "tmp",
  "sth",
  "exo",
  "usg",
  "ulg",
  "uds",
  "s99",
  "por",
  "p02",
  "ptk",
  "5ed",
  "6ed",
  "7ed",
  "dkm",
];
const wildcard = makeCategory("Wildcard Highlander", 15, wildcardSets, {
  basics: true,
  highlander: true,
  title: "Anything up to PTK/UDS, basics allowed",
});

const categories = [
  fourth,
  iceAge,
  mirage,
  ancient,
  fallenEmpire,
  normal,
  wildcard,
];
export default categories;
