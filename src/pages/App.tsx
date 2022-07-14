import WalleModal from "../components/WalletModal";
import {
  useDisclosure,
  VStack,
  HStack,
  Button,
  Text,
  Tooltip,
  Box,
  Select,
  Input,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Simulator from "../components/Simulator";
import SendTx from "../components/SendTx";
import AccountDetail from "../components/AccountDetail";
import Decoder from "../components/Decoder";

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();
  const disconnect = () => {
    deactivate();
  };

  return (
    <>
      <VStack justifyContent="center" alignItems="center" h="100vh">
        {!active ? (
          <Button onClick={onOpen}>Connect Wallet</Button>
        ) : (
          <Button onClick={disconnect}>Disconnect</Button>
        )}
        <AccountDetail />
        {active && (
          <HStack>
            {" "}
            <SendTx /> <Simulator />
          </HStack>
        )}
      </VStack>
      <Decoder />
      <WalleModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
