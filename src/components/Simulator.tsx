import {
  VStack,
  HStack,
  Button,
  Text,
  Tooltip,
  Box,
  Select,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;
const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;
if (typeof SERVER_PORT === "undefined") {
  throw new Error(
    `REACT_APP_SERVER_PORT must be a defined environment variable`
  );
}

function useSwapParameter() {
  const [calldata, setCalldata] = useState(
    "0xa6497e5c0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000000000000000000000000000000000000098968000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000180000000000000003b6d03406e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827"
  );
  const [fromAddress, setFromAddress] = useState(
    "0xbD11861D13caFa8Ad6e143DA7034f8A907CD47a8"
  );
  const [ethValue, setEthValue] = useState("0");
  const [chainId, setChainId] = useState(137);
  const [inputToken, setInputToken] = useState(
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
  );
  const [outputToken, setOutputToken] = useState(
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
  );
  const [inputAmount, setInputAmount] = useState("10000000");
  const [txHash, setTxHash] = useState("");

  return {
    calldata,
    ethValue,
    chainId,
    inputToken,
    outputToken,
    inputAmount,
    setCalldata,
    setEthValue,
    setChainId,
    setInputToken,
    setOutputToken,
    setInputAmount,
    setFromAddress,
    fromAddress,
    txHash,
    setTxHash,
  };
}

export default function Simulator() {
  const swapParam = useSwapParameter();
  const [swapResponse, setSwapResponse] = useState({ outputAmount: "0" });

  const simulateSwap = async () => {
    // swapParam;
    const url = `${SERVER_HOST}:${SERVER_PORT}/swap`;
    console.log(url);
    const params = {
      walletAddress: swapParam.fromAddress,
      calldata: swapParam.calldata,
      inputToken: swapParam.inputToken,
      outputToken: swapParam.outputToken,
      inputAmount: swapParam.inputAmount,
      chainId: swapParam.chainId,
      ethValue: swapParam.ethValue,
    };
    const res = await axios.get(url, { params });
    const quoteRes = res.data;
    const { calldata, ...rest } = quoteRes;
    setSwapResponse(rest);
  };
  return (
    <HStack justifyContent="flex-start" alignItems="flex-start">
      <Box
      // maxW="sm"
      // borderWidth="1px"
      // borderRadius="lg"
      // overflow="hidden"
      // padding="10px"
      >
        <VStack>
          <Input
            placeholder="Set Calldata"
            maxLength={1000}
            onChange={(e) => {
              swapParam.setCalldata(e.currentTarget.value);
            }}
            w="140px"
          />
          <Input
            placeholder="Set FromAddress"
            maxLength={42}
            onChange={(e) => {
              swapParam.setFromAddress(e.currentTarget.value);
            }}
            w="140px"
          />
          <Input
            placeholder="Set EthValue"
            maxLength={32}
            onChange={(e) => {
              swapParam.setEthValue(e.currentTarget.value);
            }}
            w="140px"
          />
          <Input
            placeholder="Set InputAmount"
            maxLength={42}
            onChange={(e) => {
              swapParam.setInputAmount(e.currentTarget.value);
            }}
            w="140px"
          />

          <Input
            placeholder="Set InputToken"
            maxLength={42}
            onChange={(e) => {
              swapParam.setInputToken(e.currentTarget.value);
            }}
            w="140px"
          />
          <Input
            placeholder="Set OutputToken"
            maxLength={42}
            value={swapParam.outputToken}
            onChange={(e) => {
              swapParam.setOutputToken(e.currentTarget.value);
            }}
            w="140px"
          />

          <Input
            placeholder="Set ChainId"
            maxLength={10}
            onChange={(e) => {
              swapParam.setChainId(Number(e.currentTarget.value));
            }}
            w="140px"
          />
          <Button onClick={simulateSwap} isDisabled={!swapParam.calldata}>
            Simulate Swap
          </Button>

          <div>
            <pre>{JSON.stringify(swapResponse, null, 4)}</pre>
          </div>
        </VStack>
      </Box>
    </HStack>
  );
}
