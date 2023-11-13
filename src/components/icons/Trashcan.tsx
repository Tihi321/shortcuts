import { styled } from "solid-styled-components";
import { TStyledProps } from "../../typings/components";

const IconStyled = styled("svg")`
  path {
    fill: ${(props) => props?.theme?.colors.text};
  }
`;

export const Trashcan = ({ className }: TStyledProps) => (
  <IconStyled
    class={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 3V4H3V15C3 15.5523 3.44772 16 4 16H12C12.5523 16 13 15.5523 13 15V4H14V3H13H3H2ZM4 4V15H12V4H4Z"
    />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 6H7V13H6V6Z" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 6H10V13H9V6Z" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 1V0H11V1H5Z" />
  </IconStyled>
);
