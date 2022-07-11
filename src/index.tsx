import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import "./index.css";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import { getLibrary } from "./utils/getLibrary";

const Web3ProviderNetwork = createWeb3ReactRoot("NETWORK");
const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <App />
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
