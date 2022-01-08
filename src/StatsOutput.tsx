import { useMemo } from "react";
import Box from "ui-box";

import { Categorised } from "./Card";

type Props = { cards: Categorised[] };

function strCount(haystack: string, needle: string) {
  let i = 0;
  let c = 0;
  while (true) {
    i = haystack.indexOf(needle, i);
    if (i === -1) return c;

    c++;
    i++;
  }
}

const colours = {
  W: "rgb(250,230,190)",
  U: "rgb(170,200,210)",
  B: "rgb(180,160,160)",
  R: "rgb(210,140,120)",
  G: "rgb(140,170,140)",
  C: "rgb(220,220,220)",
};
type Colour = keyof typeof colours;

function ColourOutput({
  colour,
  value,
  total,
}: {
  colour: Colour;
  value: number;
  total: number;
}) {
  const percentage = useMemo(
    () => (total ? (value * 100) / total : 0),
    [total, value]
  );
  return (
    <Box backgroundColor={colours[colour]} paddingX={2}>
      {colour} {percentage.toFixed(0)}%
    </Box>
  );
}
function getCostCount(cards: Categorised[], mana: string) {
  return cards
    .map((c) => strCount(c.card.mana || "", mana))
    .reduce((a, b) => a + b, 0);
}
function CostsOutput({ cards }: Props) {
  const w = useMemo(() => getCostCount(cards, "{W}"), [cards]);
  const u = useMemo(() => getCostCount(cards, "{U}"), [cards]);
  const b = useMemo(() => getCostCount(cards, "{B}"), [cards]);
  const r = useMemo(() => getCostCount(cards, "{R}"), [cards]);
  const g = useMemo(() => getCostCount(cards, "{G}"), [cards]);
  const total = useMemo(() => w + u + b + r + g, [b, g, r, u, w]);

  return (
    <Box display="flex" gap={4}>
      <Box fontWeight="bold">costs</Box>
      <ColourOutput colour="W" value={w} total={total} />
      <ColourOutput colour="U" value={u} total={total} />
      <ColourOutput colour="B" value={b} total={total} />
      <ColourOutput colour="R" value={r} total={total} />
      <ColourOutput colour="G" value={g} total={total} />
    </Box>
  );
}

function getSourceCount(cards: Categorised[], mana: string) {
  return cards.filter((c) => c.card.produced_mana?.includes(mana)).length;
}
function SourcesOutput({ cards }: Props) {
  const w = useMemo(() => getSourceCount(cards, "W"), [cards]);
  const u = useMemo(() => getSourceCount(cards, "U"), [cards]);
  const b = useMemo(() => getSourceCount(cards, "B"), [cards]);
  const r = useMemo(() => getSourceCount(cards, "R"), [cards]);
  const g = useMemo(() => getSourceCount(cards, "G"), [cards]);
  const c = useMemo(() => getSourceCount(cards, "C"), [cards]);
  const total = useMemo(() => w + u + b + r + g + c, [b, c, g, r, u, w]);

  return (
    <Box display="flex" gap={4}>
      <Box fontWeight="bold">sources</Box>
      <ColourOutput colour="W" value={w} total={total} />
      <ColourOutput colour="U" value={u} total={total} />
      <ColourOutput colour="B" value={b} total={total} />
      <ColourOutput colour="R" value={r} total={total} />
      <ColourOutput colour="G" value={g} total={total} />
      <ColourOutput colour="C" value={c} total={total} />
    </Box>
  );
}

export default function StatsOutput({ cards }: Props) {
  return (
    <Box display="flex" justifyContent="space-between" gap={8}>
      <Box display="flex" gap={4}>
        <Box fontWeight="bold">size</Box>
        <Box>{cards.length}/60</Box>
      </Box>
      <CostsOutput cards={cards} />
      <SourcesOutput cards={cards} />
    </Box>
  );
}
