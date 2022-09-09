import WalleModal from "../components/WalletModal";
import styled from "styled-components/macro";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Simulator from "../components/Simulator";
import SendTx from "../components/SendTx";
import Decoder from "../components/Decoder";
import Refunder from "../components/Refunder";
import Header from "../components/Header";
import TronTool from "../components/TronTool";

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 120px 16px 0px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 6rem 16px 16px 16px;
  `};
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
`;

export default function App() {
  return (
    <>
      <AppWrapper>
        <BrowserRouter>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            <Routes>
              <Route path="/" element={<Decoder />} />
              <Route path="/Simulator" element={<Simulator />} />
              <Route path="/decoder" element={<Decoder />} />
              <Route path="/sendTx" element={<SendTx />} />
              <Route path="/Refunder" element={<Refunder />} />
              <Route path="/TronTool" element={<TronTool />} />
            </Routes>
          </BodyWrapper>
        </BrowserRouter>
      </AppWrapper>
    </>
  );
}
