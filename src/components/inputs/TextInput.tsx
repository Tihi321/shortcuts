import { styled } from "solid-styled-components";

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
  text-align: center;
  color: ${(props) => props?.theme?.colors.text};
  background: ${(props) => props?.theme?.colors.ui5};
  border-width: 3px;
  border-style: solid;
  border-color: ${(props) => props?.theme?.colors.ui6};
`;

export const TextInput = ({ onChange, placeholder, value }: any) => {
  return (
    <Input
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder={placeholder}
      value={value}
    />
  );
};
