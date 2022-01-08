import "./App.css";

import { useCallback, useState } from "react";
import Box from "ui-box";

import { Categorised } from "./Card";
import CardsInput from "./CardsInput";
import MainOutput from "./MainOutput";

export default function App() {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const onShow = useCallback(
    (c: Categorised) => setImage(c.card.sets[c.set][0]),
    []
  );

  return (
    <Box display="flex" height="100vh">
      <CardsInput text={text} setText={setText} image={image} />
      <MainOutput text={text} onShow={onShow} />
    </Box>
  );
}
