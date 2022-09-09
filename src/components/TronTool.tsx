import { VStack, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import {
  fromHex,
  toHex,
  HttpProvider,
  getUrl,
  getTransactionInfo,
  toUtf8,
} from "../utils/tronweb";

export default function TronTool() {
  const [ethAddr, setEthAddr] = useState("");
  const [tronAddr, setTronAddr] = useState("");
  const [msg, setMsg] = useState("");

  const solidityNode = new HttpProvider(getUrl("main")!);
  const getTxInfo = async (txId: string) => {
    const result = await getTransactionInfo(solidityNode, txId);

    if (result.receipt.result === "SUCCESS") {
      setMsg("transaction exec success");
    } else {
      for (let i = 0; i < result.contractResult.length; i++) {
        const res = result.contractResult[i];
        if (res) {
          const errorMsg = toUtf8("0x" + res);
          setMsg(errorMsg);
        } else {
          setMsg("error message is empty");
        }
      }
    }
  };

  return (
    <VStack>
      <Text>EthAddress: </Text>
      <Input
        placeholder="EthAddress"
        maxLength={100}
        value={ethAddr}
        onChange={(e) => {
          setEthAddr(e.currentTarget.value);
          setTronAddr(fromHex(e.currentTarget.value));
        }}
        w="300px"
      />
      <Text>TronAddress: </Text>
      <Input
        placeholder="TronAddress"
        maxLength={100}
        value={tronAddr}
        onChange={(e) => {
          setTronAddr(e.currentTarget.value);
          setEthAddr(toHex(e.currentTarget.value));
        }}
        w="300px"
      />
      <Text>TxId: </Text>
      <Input
        placeholder="TxId"
        maxLength={200}
        onChange={(e) => {
          getTxInfo(e.currentTarget.value);
        }}
        w="300px"
      />
      <Text>{msg}</Text>
    </VStack>
  );
}
