import { Input, VStack, Text, Box, Button, AlertDialog } from "@chakra-ui/react";
import { useState } from "react";
import {requestGetTransferStatus, encodeTx, decodeResponse, requestRefund} from '../utils/refunder'
import { useWeb3React } from "@web3-react/core";

export default function Refunder() {
  const { library, account, activate, deactivate, active } = useWeb3React();
  const [transferId, setTransferID] = useState("");
  const [amount, setAmount] = useState("");
  const [txResult, setTxResult] = useState("");
  const [requestRefundResult, setRequestRefundResult] = useState("");
  const [decodeData, setDecodeData] = useState({});
  const [showResult, setShowResult] = useState();
  const [transferStatus, setTransferStatus] = useState({data:{status:-1}});
  const RequestGetTransferStatus = async() => {
    const res = await requestGetTransferStatus(transferId)
    setTransferStatus(res);
    setShowResult(res);
  }
  const RequestRefund = async() => {
    let res = await requestRefund(transferId, amount);
    setRequestRefundResult(res);
    setShowResult(res);
    res = await requestGetTransferStatus(transferId)
    setTransferStatus(res);
  }
  const sendTx = async () => {
    // request
    let chainId;
    try {
      chainId = await library.getSigner().provider._network.chainId;
    } catch (error) {
      alert("please connect wallet");
      return;
    }
    
    let res = await requestGetTransferStatus(transferId);
    setTransferStatus(res);
    // already request for refund
    if (res.data.status == 8){
      const inputData = {
        wd_onchain:res.data.wd_onchain,
        sorted_sigs:res.data.sorted_sigs,
        signers:res.data.signers,
        powers:res.data.powers
      }
      const _decodeData = decodeResponse(inputData);
      setDecodeData(_decodeData);
      console.log(_decodeData);
      const tx = encodeTx(_decodeData, chainId, account as string);
      console.log(tx);
      let response;
      try {
        response = await library.getSigner().sendTransaction(tx);
      } catch (error) {
        response = error;
        alert(error);
        console.log(error);
      }
      res = await requestGetTransferStatus(transferId);
      setTransferStatus(res);
    } 
    setShowResult(res);
  };

  return (
    <VStack>
      <Box>
        <VStack>
          <p>
            1.输入TransFerId，点击Search，查询退款状态<br></br>
            2.如果状态码为6为可以退款，继续输入Amount，点击refund<br></br>
            3.等待一会，点击sendTx，小狐狸发送交易退款<br></br>
          </p>
          <Input
            placeholder="transferId"
            // maxLength={5000}
            onChange={(e) => {
              setTransferID(e.currentTarget.value);
            }}
            w="1000px"
          />
          <Input
            placeholder="amount"
            // maxLength={5000}
            onChange={(e) => {
              setAmount(e.currentTarget.value);
            }}
            isDisabled = {transferStatus.data.status != 6}
            w="1000px"
          />
          <Button
            onClick={RequestGetTransferStatus}
          >Search</Button>
          <Button
            onClick={RequestRefund}
            isDisabled = {transferStatus.data.status != 6}
          >Reund</Button>
          <Button
            onClick={sendTx}
            isDisabled = {transferStatus.data.status != 8}
          >SendTx</Button>
          <Text
            maxWidth={1000}
          ><pre>{JSON.stringify(showResult, null, 4)}</pre></Text>
        </VStack>
      </Box>
      
    </VStack>
  );
}