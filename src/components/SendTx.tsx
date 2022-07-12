import { useState } from "react";
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

function useTxParameter() {
  const [calldata, setCalldata] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [ethValue, setEthValue] = useState("");
  const [txHash, setTxHash] = useState("");

  return {
    calldata,
    toAddress,
    ethValue,
    setCalldata,
    setToAddress,
    setEthValue,
    txHash,
    setTxHash,
  };
}

export default function SendTx() {
  const { library, account, activate, deactivate, active } = useWeb3React();
  const txParam = useTxParameter();
  const sendTx = async () => {
    const value = txParam.ethValue;
    const tx = {
      data: txParam.calldata,
      ...(value ? { value } : {}),
      from: account,
      to: txParam.toAddress,
    };
    const response = await library.getSigner().sendTransaction(tx);
    txParam.setTxHash(response.hash);
  };

  return (
    <HStack justifyContent="flex-start" alignItems="flex-start">
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        padding="10px"
      >
        <VStack>
          <Input
            placeholder="Set Calldata"
            maxLength={1000}
            onChange={(e) => {
              txParam.setCalldata(e.currentTarget.value);
            }}
            w="140px"
          />
          <Input
            placeholder="Set ToAddress"
            maxLength={42}
            onChange={(e) => {
              txParam.setToAddress(e.currentTarget.value);
            }}
            w="140px"
          />
          <Input
            placeholder="Set EthValue"
            maxLength={32}
            onChange={(e) => {
              txParam.setEthValue(e.currentTarget.value);
            }}
            w="140px"
          />
          <Button
            onClick={sendTx}
            isDisabled={!(txParam.calldata && txParam.toAddress)}
          >
            Send Tx
          </Button>

          {txParam.txHash ? (
            <Tooltip label={txParam.txHash} placement="bottom">
              <Text>{`Signature: ${txParam.txHash}`}</Text>
            </Tooltip>
          ) : null}
        </VStack>
      </Box>
    </HStack>
  );
}
