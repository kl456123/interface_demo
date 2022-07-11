import { AbstractConnector } from "@web3-react/abstract-connector";
import { injected } from "../connectors";
import METAMASK_ICON_URL from "../assets/images/metamask.png";
import INJECTED_ICON_URL from "../assets/images/arrow-right.svg";

interface WalletInfo {
  connector: AbstractConnector;
  name: string;
  iconURL: string;
  description: string;
  href: string | null;
  color: string;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: "Injected",
    iconURL: INJECTED_ICON_URL,
    description: "Injected web3 provider.",
    href: null,
    color: "#010101",
  },
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    iconURL: METAMASK_ICON_URL,
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
};
