import { styled } from "solid-styled-components";

export const HideContainer = styled("div")`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0px;
  border-radius: 6px;
  text-align: left;
  width: 100%;
  max-width: 230px;
  border-width: 3px;
  border-style: solid;
  border-color: ${(props) => props?.theme?.colors.ui6};
  background-color: ${(props) => props?.theme?.colors.ui1};
`;
