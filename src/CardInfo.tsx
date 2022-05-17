import { useCallback } from "react";
import Box from "ui-box";

import Card, { Categorised } from "./Card";

type Props = { card: Categorised; onShow(card: Card, set: string): void };
export default function CardInfo({ card, onShow }: Props) {
  const onHover = useCallback(
    () => onShow(card.card, card.set),
    [card, onShow]
  );

  return (
    <Box display="flex" onMouseEnter={onHover}>
      <Box fontFamily="monospace" background="silver">
        {card.set}
      </Box>
      <Box flex={1}>{card.card.name}</Box>
      <Box>{card.card.mana}</Box>
    </Box>
  );
}
