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
  background: ${(props) => props?.theme?.colors.ui1};
  border-radius: 6px;
  border-width: 3px;
  border-style: solid;
  border-color: ${(props) => props?.theme?.colors.ui6};
  transition: opacity 0.3s ease, background 0.3s ease;

  &:hover,
  &:active,
  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.9;

    background: ${(props) => alpha(props?.theme?.colors.ui1, 0.3)};
  }

  &:active {
    opacity: 0.8;

    background: ${(props) => alpha(props?.theme?.colors.ui1, 0.2)};
  }

  &:focus {
    outline: 2px solid ${(props) => alpha(props?.theme?.colors.ui1, 0.2)};
  }

  &:disabled {
    opacity: 0.7;
  }
`;
