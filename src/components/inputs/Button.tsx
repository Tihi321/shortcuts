import { styled } from "solid-styled-components";
import { alpha } from "../../utils";

export const Button = styled("button")`
  display: inline-flex;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0px;
  text-align: center;
  color: ${(props) => props?.theme?.colors.text};
  background-color: ${(props) => {
    switch (props?.name) {
      case "secondary":
        return props?.theme?.colors.ui3;
      case "warning":
        return props?.theme?.colors.ui4;

      default:
        return props?.theme?.colors.ui2;
    }
  }};
  border-radius: 6px;
  border-width: 3px;
  border-style: solid;
  border-color: ${(props) => props?.theme?.colors.ui6};
  transition: opacity 0.3s ease, background-color 0.3s ease;

  &:hover,
  &:active,
  &:focus {
    outline: none;
  }

  &:hover {
    filter: ${(props) => `drop-shadow(2px 1px 2px ${props?.theme?.colors.ui6})`};
  }

  &:focus,
  &:active {
    outline: 2px solid ${(props) => alpha(props?.theme?.colors.ui1, 0.4)};
  }

  &:disabled {
    cursor: no-drop;
    filter: grayscale(0.5);
  }
`;
