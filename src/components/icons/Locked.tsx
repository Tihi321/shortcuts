import { styled } from "solid-styled-components";
import { TStyledProps } from "../../typings/components";

const IconStyled = styled("svg")`
  path {
    fill: ${(props) => props?.theme?.colors.text};
  }
`;

export const Locked = ({ className }: TStyledProps) => (
  <IconStyled class={className} fill="none" viewBox="0 0 16 16" height="16" width="16" role="img">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4 7V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V7H12.5C13.3284 7 14 7.67157 14 8.5V14.5C14 15.3284 13.3284 16 12.5 16H3.5C2.67157 16 2 15.3284 2 14.5V8.5C2 7.67157 2.67157 7 3.5 7H4ZM11 7V4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4V7H11ZM3 8.5C3 8.22386 3.22386 8 3.5 8H12.5C12.7761 8 13 8.22386 13 8.5V14.5C13 14.7761 12.7761 15 12.5 15H3.5C3.22386 15 3 14.7761 3 14.5V8.5Z"
    />
  </IconStyled>
);
