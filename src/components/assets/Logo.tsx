import { styled, css } from "solid-styled-components";

const logo = css`
  &:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }
`;

const Image = styled("img")`
  width: 100%;
`;

const Container = styled("a")`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding: 2px;
`;

export const Logo = ({ url }: any) => {
  return (
    <Container href={url} target="_blank">
      <Image src="/logo.svg" class={logo} alt="logo" />
    </Container>
  );
};
