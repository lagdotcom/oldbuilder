import { memo, useCallback } from "react";
import Box from "ui-box";

import Card, { Categorised } from "./Card";
import Colour, { colours } from "./Colour";

const ManaSymbolSize = 17;
const ManaSymbolFontSize = ManaSymbolSize - 4;

const ManaSymbol = memo(function ManaSymbol({
  label,
  colour,
}: {
  label: string;
  colour: string;
}) {
  return (
    <Box
      display="inline-block"
      textAlign="center"
      width={ManaSymbolSize}
      height={ManaSymbolSize}
      fontSize={`${ManaSymbolFontSize}px`}
      fontWeight={500}
      lineHeight={`${ManaSymbolSize}px`}
      borderRadius={ManaSymbolSize}
      backgroundColor={colour}
    >
      {label}
    </Box>
  );
});

const manaMatcher = /\{[0123456789WUBRGX]+\}/g;

function getColour(sym: string): Colour {
  if (sym in colours) return sym as Colour;
  return "C";
}

const CardMana = memo(function CardMana({ mana }: { mana?: string }) {
  return (
    <Box textAlign="right">
      {mana?.match(manaMatcher)?.map((value, index) => {
        const sym = value.slice(1, -1);
        const colour = getColour(sym);
        return <ManaSymbol key={index} label={sym} colour={colours[colour]} />;
      })}
    </Box>
  );
});

type Props = { card: Categorised; onShow(card: Card, set: string): void };
const CardInfo = memo(function CardInfo({ card, onShow }: Props) {
  const onHover = useCallback(
    () => onShow(card.card, card.set),
    [card, onShow]
  );

  return (
    <Box display="flex" onMouseEnter={onHover}>
      <Box fontFamily="monospace" background="silver">
        {card.set}
      </Box>
      <Box flex={1} display="flex" flexDirection="column">
        <Box fontSize="0.9em">{card.card.name}</Box>
        <Box fontSize="0.7em">{card.card.type}</Box>
      </Box>
      <CardMana mana={card.card.mana} />
    </Box>
  );
});
export default CardInfo;
