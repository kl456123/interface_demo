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
    "0x238105e30000000000000000000000000000000000000000000000000000000000000020000000000000000000000000e9e7cea3dedca5984780bafc599bd69add087d560000000000000000000000008ac76a51cc950d9822d68b83fe1ad97b32cd580d0000000000000000000000001a23c4272309cffdd29ce043990e96f0b37c706300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000089000000000000000000000000000000000000000000000000c249fdd327780000000000000000000000000000000000000000000000000000b95feb9c55c1eb6f000000000000000000000000000000000000000000000000b95feb9c55c1eb6f000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000d1c5966f9f5ee6881ff6b261bbeda45972b1b5f30000000000000000000000008965349fb649a33a30cbfda057d8ec2c48abe2a200000000000000000000000000000000000000000000000000000000000000c4d6576868000000000000000000000000e9e7cea3dedca5984780bafc599bd69add087d56000000000000000000000000000000000000000000000000c249fdd327780000000000000000000000000000000000000000000000000000c03e837cf1936b6f0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000180000000000000003b7c4580d215f5a4789fb2778d7f0efcf58ca8f5322c8f8e00000000000000000000000000000000000000000000000000000000"
  );
  const [fromAddress, setFromAddress] = useState(
    "0xbD11861D13caFa8Ad6e143DA7034f8A907CD47a8"
  );
  const [bridge, setBridge] = useState(1);
  const [ethValue, setEthValue] = useState("0");
  const [chainId, setChainId] = useState(56);
  const [inputToken, setInputToken] = useState(
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
  );
  const [outputToken, setOutputToken] = useState(
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"
  );
  const [inputAmount, setInputAmount] = useState("14000000000000000000");
  const [txHash, setTxHash] = useState("");

  const [blockNumber, setBlockNumber] = useState(-1);

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
    bridge,
    setBridge,
  };
}

export default function Simulator() {
  const swapParam = useSwapParameter();
  const [swapResponse, setSwapResponse] = useState({ outputAmount: "0" });

  const simulateSwap = async () => {
    // swapParam;
    const url = `${SERVER_HOST}:${SERVER_PORT}/swap`;
    const params = {
      walletAddress: swapParam.fromAddress,
      calldata: swapParam.calldata,
      inputToken: swapParam.inputToken,
      outputToken: swapParam.outputToken,
      inputAmount: swapParam.inputAmount,
      chainId: swapParam.chainId,
      ethValue: swapParam.ethValue ?? undefined,
      blockNumber:
        swapParam.blockNumber < 0 ? undefined : swapParam.blockNumber,
      bridge: swapParam.bridge,
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
            placeholder="FromAddress"
            maxLength={42}
            onChange={(e) => {
              swapParam.setFromAddress(e.currentTarget.value);
            }}
            w="300px"
          />
          <Input
            placeholder="EthValue"
            maxLength={32}
            onChange={(e) => {
              swapParam.setEthValue(e.currentTarget.value);
            }}
            w="300px"
          />
          <Input
            placeholder="InputAmount"
            maxLength={42}
            onChange={(e) => {
              swapParam.setInputAmount(e.currentTarget.value);
            }}
            w="300px"
          />

          <Input
            placeholder="InputToken"
            maxLength={42}
            onChange={(e) => {
              swapParam.setInputToken(e.currentTarget.value);
            }}
            w="300px"
          />
          <Select
            placeholder="Select Mode"
            onChange={(e) => {
              swapParam.setBridge(parseInt(e.currentTarget.value));
            }}
          >
            <option value="0">DEX</option>
            <option value="1">Bridge</option>
          </Select>
          <Input
            placeholder="OutputToken"
            maxLength={42}
            onChange={(e) => {
              swapParam.setOutputToken(e.currentTarget.value);
            }}
            w="300px"
          />

          <Input
            placeholder="ChainId"
            maxLength={10}
            onChange={(e) => {
              swapParam.setChainId(parseInt(e.currentTarget.value));
            }}
            w="300px"
          />
          <Input
            placeholder="BlockNumber"
            maxLength={10}
            onChange={(e) => {
              swapParam.setBlockNumber(parseInt(e.currentTarget.value));
            }}
            w="300px"
          />
          <Input
            placeholder="Calldata"
            maxLength={5000}
            onChange={(e) => {
              swapParam.setCalldata(e.currentTarget.value);
            }}
            w="300px"
            h="100px"
          />
          <Button
            onClick={simulateSwap}
            isDisabled={!swapParam.calldata || swapParam.bridge !== NaN}
          >
            Simulate
          </Button>

          <div>
            <pre>{JSON.stringify(swapResponse, null, 4)}</pre>
          </div>
        </VStack>
      </Box>
    </HStack>
  );
}
