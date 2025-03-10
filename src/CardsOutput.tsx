import { useCallback, useMemo } from "react";
import Box from "ui-box";

import Card, { Categorised } from "./Card";
import CardInfo from "./CardInfo";
import categories from "./categories";

function CategoryCards({
  cards,
  name,
  onShow,
}: {
  cards: Categorised[];
  name: string;
  onShow(card: Card, set: string): void;
}) {
  const cat = useMemo(
    () => categories.find((cat) => cat.name === name),
    [name],
  );

  return (
    <Box>
      <Box
        title={cat?.title}
        display="inline"
        fontWeight="bold"
        borderBottom={cat?.title && "1px dotted black"}
        cursor={cat?.title && "help"}
      >
        {name} ({cards.length}/{cat?.limit})
      </Box>
      {cards.map((card, n) => (
        <CardInfo key={n} card={card} onShow={onShow} />
      ))}
    </Box>
  );
}

const errorColour = "#fdd";

function ErrorCategory({
  cards,
  label,
  onShow,
}: {
  cards: Card[];
  label: string;
  onShow(card: Card, set: string): void;
}) {
  const hover = useCallback(
    (card: Card) => () => onShow(card, Object.keys(card.sets)[0]),
    [onShow],
  );

  return cards.length > 0 ? (
    <Box backgroundColor={errorColour}>
      <Box fontWeight="bold">{label}</Box>
      {cards.map((card, n) => (
        <Box key={n} onMouseOver={hover(card)}>
          {card.name} ({Object.keys(card.sets).join(", ")})
        </Box>
      ))}
    </Box>
  ) : null;
}

interface Props {
  matches: Record<string, Categorised[]>;
  outOfRoom: Card[];
  banned: Card[];
  overflow: Card[];
  unknown: string[];
  onShow(card: Card, set: string): void;
}
export default function CardsOutput({
  matches,
  outOfRoom,
  banned,
  overflow,
  unknown,
  onShow,
}: Props) {
  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      flexWrap="wrap"
      gap={8}
      minHeight={0}
    >
      {Object.entries(matches).map(([name, cards]) => (
        <CategoryCards key={name} name={name} cards={cards} onShow={onShow} />
      ))}

      <ErrorCategory label="Out of Room" cards={outOfRoom} onShow={onShow} />
      <ErrorCategory label="Banned" cards={banned} onShow={onShow} />
      <ErrorCategory label="Too Many" cards={overflow} onShow={onShow} />

      {unknown.length > 0 && (
        <Box backgroundColor={errorColour}>
          <Box fontWeight="bold">Unknown Cards</Box>
          {unknown.map((name, n) => (
            <Box key={n}>{name}</Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
