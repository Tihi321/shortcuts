import { createSignal, createEffect } from "solid-js";
import { styled } from "solid-styled-components";
import { emit, listen } from "@tauri-apps/api/event";
import { MESSAGES } from "./constants";
import { Button } from "./components/inputs/Button";
import { TextInput } from "./components/inputs/TextInput";
import { Logo } from "./components/assets/Logo";
import isEmpty from "lodash/isEmpty";
import { openFile } from "./hooks/file";

const Container = styled("div")`
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const Header = styled("div")`
  display: flex;
  flex-direction: row;
  padding: 8px;
  margin-bottom: 8px;
  background: ${(props) => props?.theme?.colors.ui5};
`;

const Title = styled("h2")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: default;
  flex: 1;
  margin: 0;
  padding: 0;
  line-height: 1;
  color: ${(props) => props?.theme?.colors.text};
`;

const Main = styled("div")`
  display: flex;
  flex-direction: row;
  padding: 8px;
  margin-bottom: 8px;
`;

export const App = () => {
  const [path, setPath] = createSignal("");
  const [title, setTitle] = createSignal("");

  createEffect(() => {
    const unlisten = listen(MESSAGES.ADD_SHORTCUT, (event: any) => {
      console.log(event);

      // Cleanup listener when component is unmounted
      return () => unlisten.then((fn) => fn());
    });
  });

  return (
    <Container>
      <Header>
        <Logo url="\" />
        <Title>Shortcuts</Title>
      </Header>
      <Main>
        <Button
          onClick={async () => {
            const selected = (await openFile()) as string;
            setPath(selected);
          }}
        >
          Select Path
        </Button>
        {path()}
        <TextInput onChange={setTitle} placeholder="Enter a title..." />
        <Button
          disabled={isEmpty(title()) || isEmpty(path())}
          onClick={() => {
            emit(MESSAGES.ADD_SHORTCUT, { title: title(), path: path() });
          }}
        >
          Add shortcut
        </Button>
      </Main>
    </Container>
  );
};
