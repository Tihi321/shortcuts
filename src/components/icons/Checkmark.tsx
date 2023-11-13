import { styled } from "solid-styled-components";
import { TStyledProps } from "../../typings/components";

const IconStyled = styled.svg`
  fill: ${(props) => props?.theme?.colors.text};
`;

export const Checkmark = ({ className }: TStyledProps) => (
  <IconStyled
    width="10"
    height="8"
    view-box="0 0 10 8"
    fill-rule="evenodd"
    xmlns="http://www.w3.org/2000/svg"
    class={className}
  >
    <path d="M8.498 0L10 1.502 3.672 7.83 0 4.158l1.502-1.502 2.17 2.17z"></path>
  </IconStyled>
);
