import { useMemo } from "react";
import Box from "ui-box";

import Card from "./Card";
import CardsOutput from "./CardsOutput";
import { parseCardsText } from "./logic";
import StatsOutput from "./StatsOutput";

type Props = { text: string; onShow(card: Card, set: string): void };
export default function MainOutput({ onShow, text }: Props) {
  const { count, matches, outOfRoom, banned, overflow, unknown } = useMemo(
    () => parseCardsText(text),
    [text]
  );

  return (
    <Box flex={1} display="flex" flexDirection="column" height="100vh" gap={8}>
      <StatsOutput count={count} cards={Object.values(matches).flat()} />
      <CardsOutput
        matches={matches}
        outOfRoom={outOfRoom}
        banned={banned}
        overflow={overflow}
        unknown={unknown}
        onShow={onShow}
      />
    </Box>
  );
}
