import { NavLink } from "react-router-dom";
import { darken } from "polished";
import useScrollPosition from "@react-hook/window-scroll";
import { useActiveWeb3React } from "../../hooks/web3";
import Row from "../Row";
import { Text } from "rebass";
import { useDarkModeManager } from "../../state/user/hooks";
import Web3Status from "../Web3Status";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";

import styled from "styled-components/macro";
import Logo from "../../assets/svg/logo.svg";
import LogoDark from "../../assets/svg/logo_white.svg";

import { useWeb3React } from "@web3-react/core";

// import WalleModal from "../components/WalletModal";

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem;
  z-index: 21;
  position: relative;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) =>
    `linear-gradient(to bottom, transparent 50%, ${theme.bg0} 50% )}}`};
  background-position: ${({ showBackground }) =>
    showBackground ? "0 -100%" : "0 0"};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px
    ${({ theme, showBackground }) =>
      showBackground ? theme.bg2 : "transparent;"};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;

  ${({ theme }) => theme.mediaWidth.upToLarge`
      grid-template-columns: 48px 1fr 1fr;
    `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
      padding:  1rem;
          grid-template-columns: 1fr 1fr;
            `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
      padding:  1rem;
          grid-template-columns: 36px 1fr;
            `};
`;
const activeClassName = "ACTIVE";

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 12px;
  word-break: break-word;
  overflow: hidden;
  white-space: nowrap;
  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    justify-content: center;
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg2};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

const HeaderLinks = styled(Row)`
  justify-self: center;
  background-color: ${({ theme }) => theme.bg0};
  width: fit-content;
  padding: 4px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  overflow: auto;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    justify-self: start;
    `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-self: center;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    z-index: 99;
    position: fixed;
    bottom: 0; right: 50%;
    transform: translate(50%,-50%);
    margin: 0 auto;
    background-color: ${({ theme }) => theme.bg0};
    border: 1px solid ${({ theme }) => theme.bg2};
    box-shadow: 0px 6px 10px rgb(0 0 0 / 2%);
  `};
`;

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg1)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`;

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
      justify-self: center;
    `};
  :hover {
    cursor: pointer;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`;
const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
      align-items: center;
    `};
`;

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
    `};
`;

export default function Header() {
  const { account, chainId } = useActiveWeb3React();
  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const scrollY = useScrollPosition();

  const [darkMode] = useDarkModeManager();

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <Title href=".">
        <UniIcon>
          <img width={"24px"} src={darkMode ? LogoDark : Logo} alt="logo" />
        </UniIcon>
      </Title>
      <HeaderLinks>
        <StyledNavLink to={"/Simulator"}>Simulator</StyledNavLink>
        <StyledNavLink to={"/Decoder"}>Decoder</StyledNavLink>
        <StyledNavLink to={"/SendTx"}>SendTx</StyledNavLink>
      </HeaderLinks>
      <HeaderControls>
        <HeaderElement>
          <AccountElement active={!!account} style={{ pointerEvents: "auto" }}>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  );
}
