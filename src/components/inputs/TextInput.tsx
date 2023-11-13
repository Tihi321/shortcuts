import { styled } from "solid-styled-components";

type TTextInputProps = {
  onChange: (value: any) => void;
  placeholder?: string;
  value: any;
  name?: string;
};

const Input = styled("input")`
  display: inline-flex;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0px;
  border-radius: 6px;
  text-align: left;
  color: ${(props) => props?.theme?.colors.ui6};
  background-color: ${(props) => {
    switch (props?.name) {
      case "secondary":
        return props?.theme?.colors.ui1;

      default:
        return props?.theme?.colors.ui3;
    }
  }};
  border-width: 3px;
  border-style: solid;
  border-color: ${(props) => props?.theme?.colors.ui6};

  &::placeholder {
    color: ${(props) => props?.theme?.colors.ui6};
  }
`;

export const TextInput = ({ onChange, placeholder, value, name }: TTextInputProps) => {
  return (
    <Input
      onInput={(e) => onChange(e.currentTarget.value)}
      placeholder={placeholder}
      value={value}
      name={name}
    />
  );
};
