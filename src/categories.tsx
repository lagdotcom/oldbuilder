import { Category } from "./Card";

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
  "exo",
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
export default categories;
