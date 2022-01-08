import Box from "ui-box";

import { Categorised } from "./Card";
import CardInfo from "./CardInfo";
import categories from "./categories";

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
        <Box key={name}>
          <Box fontWeight="bold">
            {name} ({cards.length}/
            {categories.find((cat) => cat.name === name)?.limit})
          </Box>
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
