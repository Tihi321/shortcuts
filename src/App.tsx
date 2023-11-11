import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { styled, css } from "solid-styled-components";

const Container = styled("div")`
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const Logo = styled("img")`
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
`;

const vite = css`
  &:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }
`;

const tauri = css`
  &:hover {
    filter: drop-shadow(0 0 2em #24c8db);
  }
`;

const solid = css`
  &:hover {
    filter: drop-shadow(0 0 2em #2f5d90);
  }
`;

function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  return (
    <Container>
      <h1>Welcome to Tauri!</h1>

      <div class="row">
        <a href="https://vitejs.dev" target="_blank">
          <Logo src="/vite.svg" class={vite} alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <Logo src="/tauri.svg" class={tauri} alt="Tauri logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <Logo src="/solid.svg" class={solid} alt="Solid logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and Solid logos to learn more.</p>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg()}</p>
    </Container>
  );
}

export default App;
