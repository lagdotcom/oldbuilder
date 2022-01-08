import { useCallback } from "react";
import Box from "ui-box";

import { Categorised } from "./Card";

type Props = { card: Categorised; onShow(card: Categorised): void };
export default function CardInfo({ card, onShow }: Props) {
  const onHover = useCallback(() => onShow(card), [card, onShow]);

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
