import { styled } from "solid-styled-components";
import { Checkmark } from "../icons/Checkmark";

type TCheckboxProps = {
  className?: any;
  onChange: (value: boolean) => void;
  label: string;
  checked: boolean;
};

export const Button = styled("button")`
  cursor: pointer;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props?.theme?.colors.text};
  background: none;
  border: none;
`;

const Label = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
`;

const CheckmarkBorder = styled("div")`
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => props?.theme?.colors.text};
`;

export const Checkbox = ({ onChange, label, checked, className }: TCheckboxProps) => {
  return (
    <Button class={className} onClick={() => onChange(!checked)}>
      <CheckmarkBorder>{checked && <Checkmark />}</CheckmarkBorder>
      <Label>{label}</Label>
    </Button>
  );
};
