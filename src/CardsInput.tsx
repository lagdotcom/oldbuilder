import { ChangeEvent, useCallback } from "react";
import Box from "ui-box";

type Props = { image?: string; text: string; setText(text: string): void };

export default function CardsInput({ image, text, setText }: Props) {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value),
    [setText]
  );

  return (
    <Box flexBasis={250} display="flex" flexDirection="column">
      <Box is="label" htmlFor="input" fontWeight="bold">
        Input
      </Box>
      <Box is="textarea" id="input" flex={1} value={text} onChange={onChange} />
      {image && <Box is="img" src={image} maxWidth="100%" />}
    </Box>
  );
}
