import { styled } from "solid-styled-components";
import { ISVGProps } from "../../typings/components";

const IconStyled = styled("svg")`
  rect {
    fill: ${(props) => props?.theme?.colors.text};
  }
`;

export interface TCubeProps extends ISVGProps {
  small?: boolean;
}

export const Cube = ({ className, title }: TCubeProps) => (
  <IconStyled
    class={className}
    width="14"
    height="14"
    view-box="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {title && <title>{title}</title>}
    <rect width="14" height="14" />
  </IconStyled>
);
