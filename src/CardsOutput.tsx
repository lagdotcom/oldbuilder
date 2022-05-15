import { useMemo } from "react";
import Box from "ui-box";

import { Categorised } from "./Card";
import CardInfo from "./CardInfo";
import categories from "./categories";

function CategoryCards({
  cards,
  name,
  onShow,
}: {
  cards: Categorised[];
  name: string;
  onShow(card: Categorised): void;
}) {
  const cat = useMemo(
    () => categories.find((cat) => cat.name === name),
    [name]
  );

  return (
    <Box key={name} title={cat?.title}>
      <Box
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

type Props = {
  matches: Record<string, Categorised[]>;
  onShow(card: Categorised): void;
  unmatched: string[];
};
export default function CardsOutput({ matches, onShow, unmatched }: Props) {
  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      flexWrap="wrap"
      gap={8}
      maxHeight="100%"
    >
      {Object.entries(matches).map(([name, cards]) => (
        <CategoryCards key={name} name={name} cards={cards} onShow={onShow} />
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
