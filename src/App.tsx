import { createSignal, createEffect, For } from "solid-js";
import { styled } from "solid-styled-components";
import { v4 } from "uuid";
import get from "lodash/get";
import filter from "lodash/filter";
import toLower from "lodash/toLower";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import includes from "lodash/includes";
import { emit, listen } from "@tauri-apps/api/event";

import { MESSAGES, VISIBILITY } from "./constants";
import { Button } from "./components/inputs/Button";
import { TextInput } from "./components/inputs/TextInput";
import { Logo } from "./components/assets/Logo";
import { openFile } from "./hooks/file";
import { FolderIcon } from "./components/icons/FolderIcon";
import { Cube } from "./components/icons/Cube";
import { Arrow } from "./components/icons/Arrow";
import { Trashcan } from "./components/icons/Trashcan";
import { Checkmark } from "./components/icons/Checkmark";
import { Checkbox } from "./components/inputs/Checkbox";

const Container = styled("div")`
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled("div")`
  display: flex;
  flex-direction: row;
  padding: 8px;
  gap: 8px;
  background: ${(props) => props?.theme?.colors.ui5};
`;

const HeaderTitle = styled("h2")`
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

const Item = styled("div")`
  border-radius: 8px;
  padding: 8px;
  display: inline-flex;
  flex-direction: column;
  min-width: 50px;
  background-color: ${(props) => props?.theme?.colors.ui2};
  border-width: 2px;
  border-style: solid;
  border-color: ${(props) => props?.theme?.colors.ui6};
  height: 100%;
`;

const ItemButtons = styled("div")`
  display: flex;
  flex-direction: row;
`;

const ItemTitle = styled("div")`
  padding: 8px;
  font-weight: bold;
  flex: 1;
  color: ${(props) => props?.theme?.colors.text};
`;

const ItemHeader = styled("div")`
  display: flex;
  flex-direction: row;
`;

const ItemFooter = styled("div")`
  padding: 8px;
`;

const Main = styled("div")`
  display: flex;
  padding: 8px;
  flex: 1;
`;

const Items = styled("div")`
  display: flex;
  height: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const Footer = styled("div")`
  display: flex;
  flex-direction: row;
  padding: 8px;
  background-color: ${(props) => props?.theme?.colors.ui5};
`;

const HeaderSearch = styled("div")`
  display: flex;
  flex-direction: row;
`;

const FooterIcon = styled("div")`
  display: flex;
  flex-direction: row;
`;

const FooterButton = styled("div")`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const FooterCheckContainer = styled("div")`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const App = () => {
  const [shortcuts, setShortcuts] = createSignal([]);
  const [search, setSearch] = createSignal("");
  const [path, setPath] = createSignal("");
  const [name, setName] = createSignal("");

  const filteredItems = () => {
    const searchQuery = toLower(search());

    return filter(shortcuts(), (item) => {
      return includes(toLower(get(item, ["name"])), searchQuery);
    });
  };

  createEffect(() => {
    const unlisten = listen(MESSAGES.SHORTCUTS_UPDATE, (event: any) => {
      const payload = get(event, ["payload"], "{}");

      try {
        const data = JSON.parse(payload);
        const dbShortcuts = get(data, ["items"], []);
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
        <HeaderTitle>Shortcuts</HeaderTitle>
        <HeaderSearch>
          <TextInput value={search()} onChange={setSearch} placeholder="Search" />
        </HeaderSearch>
      </Header>
      <Main>
        <Items>
          <For each={filteredItems()}>
            {(values: object) => (
              <Item>
                <ItemHeader>
                  <ItemTitle>{get(values, ["name"])}</ItemTitle>
                </ItemHeader>
                <ItemButtons>
                  <Button
                    name="warning"
                    onClick={() => {
                      emit(MESSAGES.REMOVE_SHORTCUT, values);
                    }}
                  >
                    <Trashcan />
                  </Button>
                  <Button
                    name="tertiary"
                    onClick={() => {
                      emit(MESSAGES.STOP_SHORTCUT, values);
                    }}
                  >
                    <Cube />
                  </Button>
                  <Button
                    onClick={() => {
                      emit(MESSAGES.START_SHORTCUT, values);
                    }}
                  >
                    <Arrow />
                  </Button>
                </ItemButtons>
                <ItemFooter>
                  <Checkbox
                    label="Hidden (shell)"
                    checked={isEqual(get(values, ["visibility"]), VISIBILITY.HIDDEN)}
                    onChange={(value) => {
                      emit(MESSAGES.UPDATE_SHORTCUT, {
                        ...values,
                        visibility: value ? VISIBILITY.HIDDEN : VISIBILITY.VISIBILE,
                      });
                    }}
                  />
                </ItemFooter>
              </Item>
            )}
          </For>
        </Items>
      </Main>
      <Footer>
        <FooterIcon>
          <Button
            title={path()}
            name="secondary"
            onClick={async () => {
              const selected = (await openFile()) as string;
              setPath(selected);
            }}
          >
            <FolderIcon />
          </Button>
          <FooterCheckContainer>{path() && <Checkmark />}</FooterCheckContainer>
        </FooterIcon>
        <FooterIcon>
          <TextInput
            name="secondary"
            value={name()}
            onChange={setName}
            placeholder="Enter a name..."
          />
          <FooterCheckContainer>{name() && <Checkmark />}</FooterCheckContainer>
        </FooterIcon>
        <FooterButton>
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
            <Checkmark />
          </Button>
        </FooterButton>
      </Footer>
    </Container>
  );
};
