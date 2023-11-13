import { styled } from "solid-styled-components";
import { TStyledProps } from "../../typings/components";

const IconStyled = styled("svg")`
  fill: ${(props) => props?.theme?.colors.text};
  transform: rotate(-90deg) scale(1.5);
`;

export const Arrow = ({ className }: TStyledProps) => (
  <IconStyled
    width="10"
    height="5"
    viewBox="0 0 10 5"
    fill-rule="evenodd"
    xmlns="http://www.w3.org/2000/svg"
    class={className}
  >
    <path d="M0 0l5 4.998L10 0z"></path>
  </IconStyled>
);
