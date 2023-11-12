import { createSignal, createEffect } from "solid-js";
import { styled } from "solid-styled-components";
import { v4 } from "uuid";
import get from "lodash/get";
import map from "lodash/map";
import { emit, listen } from "@tauri-apps/api/event";
import { MESSAGES, VISIBILITY } from "./constants";
import { Button } from "./components/inputs/Button";
import { TextInput } from "./components/inputs/TextInput";
import { Logo } from "./components/assets/Logo";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
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

const Row = styled("div")`
  display: flex;
  flex-direction: row;
`;

const Text = styled("div")`
  padding: 8px;
`;

const Checkbox = styled("input")`
  padding: 8px;
`;

const Main = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
`;

const Footer = styled("div")`
  display: flex;
  flex-direction: row;
  padding: 8px;
  margin-bottom: 8px;
`;

export const App = () => {
  const [shortcuts, setShortcuts] = createSignal([]);
  const [path, setPath] = createSignal("");
  const [name, setName] = createSignal("");

  createEffect(() => {
    const unlisten = listen(MESSAGES.SHORTCUTS_UPDATE, (event: any) => {
      const payload = get(event, ["payload"], "{}");

      try {
        const data = JSON.parse(payload);
        const dbShortcuts = get(data, ["shortcuts"], []);
        setShortcuts(dbShortcuts);
      } catch (error) {
        console.log(error);
      }
    });

    // Cleanup listener when component is unmounted
    return () => unlisten.then((fn) => fn());
  });

  createEffect(() => emit(MESSAGES.GET_SHORTCUT));

  return (
    <Container>
      <Header>
        <Logo url="\" />
        <Title>Shortcuts</Title>
      </Header>
      <Main>
        {map(shortcuts(), (values: object) => (
          <Row>
            <Text>{get(values, ["title"])}</Text>
            <Text>{get(values, ["path"])}</Text>
            <Button
              name="warning"
              onClick={() => {
                emit(MESSAGES.REMOVE_SHORTCUT, values);
              }}
            >
              Remove
            </Button>
            <Button
              onClick={() => {
                emit(MESSAGES.STOP_SHORTCUT, values);
              }}
            >
              Stop
            </Button>
            <Button
              onClick={() => {
                emit(MESSAGES.START_SHORTCUT, values);
              }}
            >
              Start
            </Button>
            <Checkbox
              type="checkbox"
              checked={isEqual(get(values, ["visibility"]), VISIBILITY.HIDDEN)}
              onChange={(event) => {
                event.stopPropagation();
                emit(MESSAGES.UPDATE_SHORTCUT, {
                  ...values,
                  visibility: isEqual(get(values, ["visibility"]), VISIBILITY.HIDDEN)
                    ? VISIBILITY.VISIBILE
                    : VISIBILITY.HIDDEN,
                });
              }}
            />{" "}
            Visibility
          </Row>
        ))}
      </Main>
      <Footer>
        <Button
          name="secondary"
          onClick={async () => {
            const selected = (await openFile()) as string;
            setPath(selected);
          }}
        >
          Select Path
        </Button>
        {path()}
        <TextInput
          key={`name-${name()}`}
          value={name()}
          onChange={setName}
          placeholder="Enter a name..."
        />
        <Button
          disabled={isEmpty(name()) || isEmpty(path())}
          onClick={() => {
            emit(MESSAGES.ADD_SHORTCUT, {
              name: name(),
              path: path(),
              visibility: VISIBILITY.VISIBILE,
              id: v4(),
            });
            setName("");
            setPath("");
          }}
        >
          Add shortcut
        </Button>
      </Footer>
    </Container>
  );
};
