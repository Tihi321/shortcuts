import { createSignal, createEffect, For, createMemo } from "solid-js";
import { styled } from "solid-styled-components";
import { v4 } from "uuid";
import get from "lodash/get";
import find from "lodash/find";
import head from "lodash/head";
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
import { ShortcutTitle } from "./components/header/ShortcutTitle";
import { Tab } from "./components/header/Tab";

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
  display: flex;
  flex-direction: row;
  gap: 4px;
  background-color: ${(props) => props?.theme?.colors.ui2};
  border-width: 2px;
  border-style: solid;
  border-color: ${(props) => props?.theme?.colors.ui6};
  height: 100%;
  width: 100%;
  flex-wrap: wrap;
`;

const ItemInputs = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ItemButtons = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 16px;
  gap: 4px;
`;

const ItemHeader = styled("div")`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const ItemFooter = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Tabs = styled("div")`
  display: flex;
  padding: 8px;
  gap: 4px;
`;

const Main = styled("div")`
  display: flex;
  padding: 8px;
  flex: 1;
`;

const Items = styled("div")`
  display: flex;
  height: 100%;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`;

interface FooterProps {
  show?: boolean;
  adding?: boolean;
}

const Footer = styled("div")<FooterProps>`
  position: fixed;
  transform: ${(props) => (props.show ? "translateY(0)" : "translateY(55px)")};
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  padding: 8px;
  background-color: ${(props) => props?.theme?.colors.ui5};
  opacity: ${(props) => (props?.adding ? 0.7 : 1)};
  pointer-events: ${(props) => (props?.adding ? "none" : "all")};
  transition: transform 0.3s ease;
`;

const HeaderSearch = styled("div")`
  display: flex;
  flex-direction: row;
`;

const FooterItem = styled("div")`
  display: flex;
  flex-direction: row;
`;

const FooterItems = styled("div")`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

const FooterAccept = styled("div")`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
`;

const FooterInput = styled(TextInput)`
  width: 230px;
`;

const FooterTabButtons = styled("div")`
  position: absolute;
  display: flex;
  top: -26px;
  right: 12px;
`;

const FooterTabButton = styled(Button)`
  padding: 4px 8px;
  width: fit-content;
  border-radius: 6px 6px 0 0;
  transform: scale(0.7) translateY(5px);

  &:hover {
    transform: scale(1) translateY(0px);
  }

  transition: transform 0.3s ease;

  &:first-child {
    margin-right: -18px;
  }
`;

const FooterCheckContainer = styled("div")`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FooterSelect = styled("select")`
  width: 160px;
  border-radius: 6px;
`;

const sortAlphabetically = (values: Array<any>, key: string) =>
  values.sort((first, second) => {
    const nameA = toLower(get(first, [key]));
    const nameB = toLower(get(second, [key]));
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

export const App = () => {
  const [selectedTab, setSelectedTab] = createSignal("");
  const [showFooter, setShowFooter] = createSignal(false);
  const [footerItem, setFooterItem] = createSignal("");
  const [addingItem, setAddingItem] = createSignal(false);
  const [shortcuts, setShortcuts] = createSignal([]);
  const [search, setSearch] = createSignal("");
  const [path, setPath] = createSignal("");
  const [name, setName] = createSignal("");
  const [tabName, setTabName] = createSignal("");
  const [tabRemoveName, setTabRemoveName] = createSignal("");
  const [args, setArgs] = createSignal("");

  const selectedItems = createMemo(
    () =>
      find(shortcuts(), (values) => isEqual(get(values, ["list"]), selectedTab())) ||
      head(shortcuts())
  );

  const tabItems = () => {
    return sortAlphabetically(shortcuts(), "list") as unknown as object[];
  };

  const filteredItems = () => {
    const searchQuery = toLower(search());
    const items = filter(get(selectedItems(), ["shortcuts"]), (item) => {
      return includes(toLower(get(item, ["name"])), searchQuery);
    });

    sortAlphabetically(items, "name");

    return sortAlphabetically(items, "name") as unknown as object[];
  };

  createEffect(() => {
    const unlisten = listen(MESSAGES.SHORTCUTS_UPDATE, (event: any) => {
      const payload = get(event, ["payload"], "{}");

      try {
        setShortcuts(JSON.parse(payload));
      } catch (error) {
        console.log(error);
      }
    });

    // Cleanup listener when component is unmounted
    return () => unlisten.then((fn: any) => fn());
  });

  createEffect(() => emit(MESSAGES.GET_SHORTCUTS));

  createEffect(() => {
    if (addingItem()) {
      setTimeout(() => {
        setAddingItem(false);
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
      <Tabs>
        <For each={tabItems()}>
          {(values: object, index) => (
            <Tab
              selected={
                isEqual(get(values, ["list"]), selectedTab()) ||
                tabItems().length === 1 ||
                (isEmpty(selectedTab()) && index() === 0)
              }
              onClick={() => {
                setSelectedTab(get(values, ["list"]));
              }}
              text={get(values, ["list"])}
              onChange={(value) => {
                console.log({
                  value,
                });

                emit(MESSAGES.RENAME_TAB, {
                  current: get(values, ["list"]),
                  new: value,
                });
              }}
            />
          )}
        </For>
      </Tabs>
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
                <ItemInputs>
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
                  <Checkbox
                    label="Hidden"
                    checked={isEqual(get(values, ["visibility"]), VISIBILITY.HIDDEN)}
                    onChange={(value) => {
                      emit(MESSAGES.UPDATE_SHORTCUT, {
                        ...values,
                        visibility: value ? VISIBILITY.HIDDEN : VISIBILITY.VISIBILE,
                      });
                    }}
                  />
                </ItemInputs>

                <ItemFooter>
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
      <Footer adding={addingItem()} show={showFooter()}>
        <FooterTabButtons>
          <FooterTabButton
            disabled={isEmpty(selectedItems())}
            datatype={footerItem() === "Shortcut" ? "" : "secondary"}
            onClick={() => {
              if (showFooter() && footerItem() !== "Shortcut") {
                setFooterItem("Shortcut");
              } else {
                setFooterItem("Shortcut");
                setShowFooter(!showFooter());
              }
            }}
          >
            Shortcut
          </FooterTabButton>
          <FooterTabButton
            datatype={footerItem() !== "Shortcut" ? "" : "secondary"}
            onClick={() => {
              if (showFooter() && footerItem() !== "Tab") {
                setFooterItem("Tab");
              } else {
                setFooterItem("Tab");
                setShowFooter(!showFooter());
              }
            }}
          >
            Tab
          </FooterTabButton>
        </FooterTabButtons>
        {!addingItem() && footerItem() === "Shortcut" && (
          <FooterItems>
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
              <FooterInput
                type="secondary"
                value={name()}
                onInput={setName}
                placeholder="Enter a name..."
              />
              <FooterCheckContainer>{name() && <Checkmark />}</FooterCheckContainer>
            </FooterItem>
            <FooterItem>
              <FooterInput
                type="secondary"
                value={args()}
                onInput={setArgs}
                placeholder="Enter a arguments..."
              />
              <FooterCheckContainer></FooterCheckContainer>
            </FooterItem>
            <FooterAccept>
              <Button
                disabled={isEmpty(name()) || isEmpty(path())}
                onClick={() => {
                  emit(MESSAGES.ADD_SHORTCUT, {
                    list: get(selectedItems(), ["list"]),
                    id: v4(),
                    name: name(),
                    path: path(),
                    visibility: VISIBILITY.VISIBILE,
                    arguments: args(),
                  });
                  setName("");
                  setPath("");
                  setArgs("");
                  setAddingItem(true);
                }}
              >
                <Checkmark />
              </Button>
            </FooterAccept>
          </FooterItems>
        )}
        {!addingItem() && footerItem() !== "Shortcut" && (
          <FooterItems>
            <FooterItem>
              <FooterInput
                type="secondary"
                value={tabName()}
                onInput={setTabName}
                placeholder="Enter a name..."
              />
              <FooterCheckContainer>{name() && <Checkmark />}</FooterCheckContainer>
            </FooterItem>
            <FooterAccept>
              <Button
                disabled={isEmpty(tabName())}
                onClick={() => {
                  emit(MESSAGES.ADD_TAB, {
                    name: tabName(),
                  });
                  setTabName("");
                  setAddingItem(true);
                }}
              >
                <Checkmark />
              </Button>
            </FooterAccept>
            <FooterSelect
              onChange={(event) => {
                setTabRemoveName(event.currentTarget.value);
              }}
            >
              <For each={tabItems()}>
                {(values: object) => (
                  <option value={get(values, ["list"])}>{get(values, ["list"])}</option>
                )}
              </For>
            </FooterSelect>
            <FooterAccept>
              <Button
                datatype="warning"
                disabled={isEmpty(tabRemoveName())}
                onClick={() => {
                  emit(MESSAGES.REMOVE_TAB, {
                    name: tabRemoveName(),
                  });
                  setTabRemoveName("");
                  setAddingItem(true);
                }}
              >
                <Trashcan />
              </Button>
            </FooterAccept>
          </FooterItems>
        )}
      </Footer>
    </Container>
  );
};
