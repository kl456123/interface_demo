import { Input, VStack, Text, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  decodeSmartSwap,
  decodeRoutePath,
  decodeSwapAndBridgeToImprove,
  decodeBridgeTo,
  decodeClaim,
  decodeReceiveGasToken,
} from "../utils/decoder";
import { BigNumber } from "ethers";

type DataType = {
  fromToken: string;
  toToken: string;
  fromTokenAmount: string;
  minReturnAmount: string;
  routePath: string;
};

export default function Decoder() {
  const [calldata, setCalldata] = useState(
    "0x8e8920e30000000000000000000000000000000000000000000000000000000000000020000000000000000000000000ef4650d070682ef1e8fd7a7efbc2d94add1a06ab00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000020080a9df0b46f727d5b37dd2ebb9e2afd50cf73e360af9edfe0371ffcb95558b8"
    // "0x3eee91560000000000000000000000000000000000000000000000000000000000000020000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000000000000001c9c3800000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000003800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000e4d6576868000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec70000000000000000000000000000000000000000000000000000000001c9c3800000000000000000000000000000000000000000000000000000000001b09dbd0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000280000000000000003b6d0340703b120f15ab77b986a24c6f9262364d02f9432f80000000000000003b6d0340b4e16d0168e52d35cacd2c6185b44281ec28c9dc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
    // "0x1543128e00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000cbfd32fdec86f88784266221cce8141da7b9a9ed000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000001550f7dca7000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000ba8da9dcf11b50b03fd5284f164ef5cdef9107050000000000000000000000000615dbba33fe61a31c7ed131bda6655ed76748b1",
    // "0x238105e30000000000000000000000000000000000000000000000000000000000000020000000000000000000000000e9e7cea3dedca5984780bafc599bd69add087d560000000000000000000000008ac76a51cc950d9822d68b83fe1ad97b32cd580d0000000000000000000000001a23c4272309cffdd29ce043990e96f0b37c706300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000089000000000000000000000000000000000000000000000000c249fdd327780000000000000000000000000000000000000000000000000000b95feb9c55c1eb6f000000000000000000000000000000000000000000000000b95feb9c55c1eb6f000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000d1c5966f9f5ee6881ff6b261bbeda45972b1b5f30000000000000000000000008965349fb649a33a30cbfda057d8ec2c48abe2a200000000000000000000000000000000000000000000000000000000000000c4d6576868000000000000000000000000e9e7cea3dedca5984780bafc599bd69add087d56000000000000000000000000000000000000000000000000c249fdd327780000000000000000000000000000000000000000000000000000c03e837cf1936b6f0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000180000000000000003b7c4580d215f5a4789fb2778d7f0efcf58ca8f5322c8f8e00000000000000000000000000000000000000000000000000000000"
    // "0xce8c431680000000000000000000000007882ae1ecb7429a84f1d53048d35c4bb205687700000000000000000000000022753e4264fddc6181dc7cce468904a80a363e44000000000000000000000000000000000000000000000a968163f0a57b400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000773594000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000a968163f0a57b4000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000005af3107a40000000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000007882ae1ecb7429a84f1d53048d35c4bb205687700000000000000000000000022753e4264fddc6181dc7cce468904a80a363e44000000000000000000000000000000000000000000000a968163f0a57b4000000000000000000000000000000000000000000000000000000e043da61725000000000000000000000000000000000000000000000000000000000000626b7ca300000000000000000000000000000000000000000000000000000000626b7efb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000f32d39ff9f6aa7a7a64d7a4f00a54826ef791a5500000000000000000000000000000000000000000000000000000000000011119dabbfb5dd014984458e089d45e8f92a48052692fcb915cf2fc5c5079b1aac50305145f54a2c7e4169510a902782b8c65b5c1a27f573c0b3efa3bbb294eab19b1805f4960e161b272621c6f508c021e872eea207322aa500d1d3396cef32f9b072799e3b975cfe03cd8c60949787097b6b93a3bd80c4b244a7fa772cd0fc6b42"
  );
  const [decodedData, setDecodedData] = useState({});
  useEffect(() => {
    if (calldata) {
      const sig = calldata.slice(0, 10);
      switch (sig) {
        case "0xce8c4316": {
          const decodedData = decodeSmartSwap(calldata);
          const encodedFromToken = BigNumber.from(
            decodedData.baseRequest.fromToken.toString()
          ).toHexString();
          const fromToken = "0x" + encodedFromToken.slice(-40);
          const routePath = decodeRoutePath(
            decodedData.batches,
            decodedData.batchesAmount
          );
          setDecodedData({
            fromToken,
            toToken: decodedData.baseRequest.toToken.toString(),
            fromTokenAmount: decodedData.baseRequest.fromTokenAmount.toString(),
            minReturnAmount: decodedData.baseRequest.minReturnAmount.toString(),
            routePath,
          });
          break;
        }
        case "0x238105e3": {
          const decodedData = decodeSwapAndBridgeToImprove(calldata);
          setDecodedData(decodedData);
          break;
        }
        case "0x1543128e": {
          const decodedData = decodeBridgeTo(calldata);
          setDecodedData(decodedData);
          break;
        }
        case "0x3eee9156": {
          const decodedData = decodeClaim(calldata);
          setDecodedData(decodedData);
          break;
        }
        case "0x8e8920e3": {
          const decodedData = decodeReceiveGasToken(calldata);
          setDecodedData(decodedData);
          break;
        }
      }
    }
  }, [calldata]);

  return (
    <VStack>
      <Box>
        <Input
          placeholder="Calldata"
          // maxLength={5000}
          onChange={(e) => {
            setCalldata(e.currentTarget.value);
          }}
          w="1000px"
        />

        <Text>{JSON.stringify(decodedData, null, 4)}</Text>
      </Box>
    </VStack>
  );
}
