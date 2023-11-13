import { styled } from "solid-styled-components";

type TTextInputProps = {
  onInput?: (value: any) => void;
  onChange?: (value: any) => void;
  placeholder?: string;
  value: string;
  type?: string;
  className?: any;
};

const Input = styled("input")`
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
  width: 100%;
  max-width: 230px;
  color: ${(props) => props?.theme?.colors.ui6};
  background-color: ${(props) => {
    switch (props?.datatype) {
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

export const TextInput = ({
  onInput,
  placeholder,
  value,
  type,
  onChange,
  className,
}: TTextInputProps) => {
  return (
    <Input
      onInput={(e) => {
        if (onInput) {
          onInput(e.currentTarget.value);
        }
      }}
      onChange={(e) => {
        if (onChange) {
          onChange(e.currentTarget.value);
        }
      }}
      placeholder={placeholder}
      value={value}
      datatype={type}
      class={className}
    />
  );
};
