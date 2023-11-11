/* @refresh reload */
import { ThemeProvider } from "solid-styled-components";
import { render } from "solid-js/web";

import "./styles.css";
import App from "./App";
import { theme } from "./theme/theme";

render(
  () => (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  ),
  document.getElementById("root") as HTMLElement
);
