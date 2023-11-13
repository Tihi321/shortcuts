import { styled } from "solid-styled-components";
import { TStyledProps } from "../../typings/components";

const IconStyled = styled("svg")`
  path {
    fill: ${(props) => props?.theme?.colors.text};
  }
`;

export const LaunchIcon = ({ className }: TStyledProps) => (
  <IconStyled
    class={className}
    fill-rule="evenodd"
    viewBox="0 0 16 16"
    height={16}
    width={16}
    role="img"
  >
    <path d="M14.3 1h-3.8V0H16v5.5h-1V1.7L9.7 7 9 6.3 14.3 1z"></path>
    <path d="M14.3 1h-3.8V0H16v5.5h-1V1.7L9.7 7 9 6.3 14.3 1z"></path>
    <path d="M13 9h1v6c0 .6-.4 1-1 1H1c-.6 0-1-.4-1-1V3c0-.6.4-1 1-1h7v1H1v12h12V9z"></path>
  </IconStyled>
);
