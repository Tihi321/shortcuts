import { createSignal } from "solid-js";
import { styled } from "solid-styled-components";

const Container = styled("div")`
  cursor: default;
  padding: 8px;
  font-weight: bold;
  flex: 1;
  color: ${(props) => props?.theme?.colors.text};
`;

export interface ShortcutTitleProps {
  text: string;
  onChange: (value: string) => void;
}

export const ShortcutTitle = ({ text, onChange }: ShortcutTitleProps) => {
  const [updateTitle, setUpdateTitle] = createSignal(false);
  return (
    <Container
      contenteditable={updateTitle()}
      onDblClick={(event) => {
        event.currentTarget.focus();
        if (event.currentTarget.innerText !== text) {
          onChange(event.currentTarget.innerText);
        }
        setUpdateTitle(!updateTitle());
      }}
      onKeyPress={(event) => {
        if (event.key === "Enter") {
          if (event.currentTarget.innerText !== text) {
            onChange(event.currentTarget.innerText);
          }
          setUpdateTitle(!updateTitle());
        }
      }}
    >
      {text}
    </Container>
  );
};
