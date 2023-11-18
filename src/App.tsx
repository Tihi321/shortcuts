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
import { LockedInput } from "./components/inputs/LockedInput";
import { LaunchIcon } from "./components/icons/Launch";
import { HideContainer } from "./components/common/HideContainer";
import { ShortcutTitle } from "./components/header/ShortcutTitle";

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
  gap: 8px;
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
  justify-content: space-between;
`;

const ItemHeader = styled("div")`
  display: flex;
  flex-direction: row;
`;

const ItemFooter = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  opacity: ${(props) => (props?.datatype == "adding" ? 0.7 : 1)};
  pointer-events: ${(props) => (props?.datatype == "adding" ? "none" : "all")};
`;

const HeaderSearch = styled("div")`
  display: flex;
  flex-direction: row;
`;

const FooterItem = styled("div")`
  display: flex;
  flex-direction: row;
`;

const FooterAccept = styled("div")`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
`;

const FooterInput = styled(TextInput)`
  width: 230px;
`;

const FooterHideContainer = styled(HideContainer)`
  width: 230px;
  height: 38px;
`;

const FooterCheckContainer = styled("div")`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const App = () => {
  const [addingShortcuts, setAddingShortcuts] = createSignal("");
  const [shortcuts, setShortcuts] = createSignal([]);
  const [search, setSearch] = createSignal("");
  const [path, setPath] = createSignal("");
  const [name, setName] = createSignal("");
  const [args, setArgs] = createSignal("");

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
        const dbShortcuts = get(data, [0, "shortcuts"], []);
        setShortcuts(dbShortcuts);
      } catch (error) {
        console.log(error);
      }
    });

    // Cleanup listener when component is unmounted
    return () => unlisten.then((fn) => fn());
  });

  createEffect(() => emit(MESSAGES.GET_SHORTCUTS));

  createEffect(() => {
    if (addingShortcuts()) {
      setTimeout(() => {
        setAddingShortcuts("");
      }, 500);
    }
  });

  return (
    <Container>
      <Header>
        <Logo url="\" />
        <HeaderTitle>Shortcuts</HeaderTitle>
        <HeaderSearch>
          <TextInput value={search()} onInput={setSearch} placeholder="Search" />
        </HeaderSearch>
      </Header>
      <Main>
        <Items>
          <For each={filteredItems()}>
            {(values: object) => (
              <Item>
                <ItemHeader>
                  <ShortcutTitle
                    onChange={(value) => {
                      emit(MESSAGES.UPDATE_SHORTCUT, {
                        ...values,
                        name: value,
                      });
                    }}
                    text={get(values, ["name"])}
                  />
                  <Button
                    datatype="secondary"
                    onClick={() => {
                      emit(MESSAGES.OPEN_PATH, values);
                    }}
                  >
                    <LaunchIcon />
                  </Button>
                </ItemHeader>
                <ItemButtons>
                  <Button
                    datatype="warning"
                    onClick={() => {
                      emit(MESSAGES.REMOVE_SHORTCUT, values);
                    }}
                  >
                    <Trashcan />
                  </Button>
                  <Button
                    datatype="tertiary"
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
                  <LockedInput
                    value={get(values, ["arguments"], "")}
                    onChange={(value) => {
                      emit(MESSAGES.UPDATE_SHORTCUT, {
                        ...values,
                        arguments: value,
                      });
                    }}
                    placeholder="Enter a arguments..."
                  />
                </ItemFooter>
              </Item>
            )}
          </For>
        </Items>
      </Main>
      <Footer datatype={addingShortcuts()}>
        <FooterItem>
          <Button
            title={path()}
            datatype="secondary"
            onClick={async () => {
              const selected = (await openFile()) as string;
              setPath(selected);
            }}
          >
            <FolderIcon />
          </Button>
          <FooterCheckContainer>{path() && <Checkmark />}</FooterCheckContainer>
        </FooterItem>
        <FooterItem>
          {addingShortcuts() ? (
            <FooterHideContainer />
          ) : (
            <FooterInput
              type="secondary"
              value={name()}
              onInput={setName}
              placeholder="Enter a name..."
            />
          )}
          <FooterCheckContainer>{name() && <Checkmark />}</FooterCheckContainer>
        </FooterItem>
        <FooterItem>
          {addingShortcuts() ? (
            <FooterHideContainer />
          ) : (
            <FooterInput
              type="secondary"
              value={args()}
              onInput={setArgs}
              placeholder="Enter a arguments..."
            />
          )}
        </FooterItem>
        <FooterAccept>
          <Button
            disabled={isEmpty(name()) || isEmpty(path())}
            onClick={() => {
              emit(MESSAGES.ADD_SHORTCUT, {
                list: "main",
                id: v4(),
                name: name(),
                path: path(),
                visibility: VISIBILITY.VISIBILE,
                arguments: args(),
              });
              setName("");
              setPath("");
              setArgs("");
              setAddingShortcuts("adding");
            }}
          >
            <Checkmark />
          </Button>
        </FooterAccept>
      </Footer>
    </Container>
  );
};
