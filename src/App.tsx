import { useCallback, useState } from "react";
import Box from "ui-box";

import Card from "./Card";
import CardsInput from "./CardsInput";
import MainOutput from "./MainOutput";

export default function App() {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const onShow = useCallback(
    (card: Card, set: string) => setImage(card.sets[set][0]),
    []
  );

  return (
    <Box display="flex" height="100vh">
      <CardsInput text={text} setText={setText} image={image} />
      <MainOutput text={text} onShow={onShow} />
    </Box>
  );
}
