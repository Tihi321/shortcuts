import { styled } from "solid-styled-components";
import { TStyledProps } from "../../typings/components";

const IconStyled = styled("svg")`
  fill: ${(props) => props?.theme?.colors.text};
`;

export const FolderIcon = ({ className }: TStyledProps) => (
  <IconStyled
    class={className}
    fill-rule="evenodd"
    height="12"
    role="img"
    view-box="0 0 14 12"
    width="14"
  >
    <path d="M13 12H1a1 1 0 0 1-1-1V1.001a1 1 0 0 1 1.002-1l2.293.005a1 1 0 0 1 .704.291L5.707 2H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zm0-9H5.707A1 1 0 0 1 5 2.708L3.293 1.006 1 1v10h12V3z"></path>
  </IconStyled>
);
