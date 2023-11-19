import { createSignal } from "solid-js";
import { styled } from "solid-styled-components";

interface ContainerProps {
  selected?: boolean;
}

const Container = styled("div")<ContainerProps>`
  cursor: pointer;
  border-radius: 8px;
  padding: 8px;
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  min-width: 50px;
  background-color: ${(props) => props?.theme?.colors.ui2};
  border-width: 2px;
  border-style: solid;
  border-color: ${(props) => (props.selected ? props?.theme?.colors.ui6 : "transparent")};
  color: ${(props) => props?.theme?.colors.text};
  user-select: none;

  &:hover {
    opacity: 0.7;
  }
`;

export interface TabProps {
  selected?: boolean;
  text: string;
  onChange: (value: string) => void;
  onClick: () => void;
}

export const Tab = ({ text, onChange, onClick, selected }: TabProps) => {
  const [updateTitle, setUpdateTitle] = createSignal(false);
  return (
    <Container
      selected={selected}
      onClick={onClick}
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
