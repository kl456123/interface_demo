import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import store from "./state";
import "./index.css";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import { getLibrary } from "./utils/getLibrary";
import { NetworkContextName } from "./constants/misc";
import ThemeProvider, { ThemedGlobalStyle } from "./theme";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);
const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
