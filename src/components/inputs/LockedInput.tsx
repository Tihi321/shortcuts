import { createEffect, createSignal } from "solid-js";
import { styled } from "solid-styled-components";
import { TextInput } from "./TextInput";
import { Button } from "./Button";
import { Locked } from "../icons/Locked";

type TLockedInputProps = {
  onChange?: (value: any) => void;
  placeholder?: string;
  value: string;
  type?: string;
};

const Container = styled("div")`
  display: flex;
  gap: 8px;
`;

const Text = styled("div")`
  display: flex;
  flex: 1;
  align-items: center;
  text-align: left;
  font-size: 16px;
  color: ${(props) => props?.theme?.colors.text};
  width: 100%;
  overflow: hidden;
`;

export const LockedInput = ({ placeholder, value, onChange, type }: TLockedInputProps) => {
  const [locked, setLocked] = createSignal(true);

  createEffect(() => {
    if (value) {
      setLocked(true);
    }
  });

  return (
    <Container>
      <Button datatype={locked() ? "warning" : "primary"} onClick={() => setLocked(!locked())}>
        <Locked />
      </Button>
      {locked() ? (
        <Text>{value}</Text>
      ) : (
        <TextInput onChange={onChange} placeholder={placeholder} value={value} type={type} />
      )}
    </Container>
  );
};
