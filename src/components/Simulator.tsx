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
    "0xce8c4316000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000bebc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000062cd46200000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000004400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000bebc200000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000160000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000000000000000000000000100000000000000000000000003f911aedc25c770e701b8f563e8102cfacd62c0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000003f911aedc25c770e701b8f563e8102cfacd62c000000000000000000000000000000000000000000000000000000000000000018000000000000000000027107858e59e0c01ea06df3af3d20ac7b0003275d4bf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000060000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000000001f40000000000000000000000000000000000000000000000000000000000000000"
  );
  const [fromAddress, setFromAddress] = useState(
    "0xbD11861D13caFa8Ad6e143DA7034f8A907CD47a8"
  );
  const [ethValue, setEthValue] = useState("0");
  const [chainId, setChainId] = useState(1);
  const [inputToken, setInputToken] = useState(
    "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  );
  const [outputToken, setOutputToken] = useState(
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  );
  const [inputAmount, setInputAmount] = useState("200000000");
  const [txHash, setTxHash] = useState("");

  const [blockNumber, setBlockNumber] = useState(15125430);

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
    blockNumber,
    setBlockNumber,
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
      blockNumber: swapParam.blockNumber,
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
            placeholder="Calldata"
            maxLength={5000}
            onChange={(e) => {
              swapParam.setCalldata(e.currentTarget.value);
            }}
            w="140px"
          />
          <Input
            placeholder="FromAddress"
            maxLength={42}
            onChange={(e) => {
              swapParam.setFromAddress(e.currentTarget.value);
            }}
            w="140px"
          />
          <Input
            placeholder="EthValue"
            maxLength={32}
            onChange={(e) => {
              swapParam.setEthValue(e.currentTarget.value);
            }}
            w="140px"
          />
          <Input
            placeholder="InputAmount"
            maxLength={42}
            onChange={(e) => {
              swapParam.setInputAmount(e.currentTarget.value);
            }}
            w="140px"
          />

          <Input
            placeholder="InputToken"
            maxLength={42}
            onChange={(e) => {
              swapParam.setInputToken(e.currentTarget.value);
            }}
            w="140px"
          />
          <Input
            placeholder="OutputToken"
            maxLength={42}
            value={swapParam.outputToken}
            onChange={(e) => {
              swapParam.setOutputToken(e.currentTarget.value);
            }}
            w="140px"
          />

          <Input
            placeholder="ChainId"
            maxLength={10}
            onChange={(e) => {
              swapParam.setChainId(parseInt(e.currentTarget.value));
            }}
            w="140px"
          />
          <Input
            placeholder="BlockNumber"
            maxLength={10}
            onChange={(e) => {
              swapParam.setBlockNumber(parseInt(e.currentTarget.value));
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
