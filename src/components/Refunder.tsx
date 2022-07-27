import { Input, VStack, Text, Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import {requestGetTransferStatus, encodeCalldata, decodeResponse} from '../utils/refunder'
import { useWeb3React } from "@web3-react/core";

export default function Refunder() {
  const { library, account, activate, deactivate, active } = useWeb3React();
  const [transferId, setTransferID] = useState("");
  const [decodedData, setDecodedData] = useState({});
  const [refundFlag, setRefundFlag] = useState(false);
  const RequestGetTransferStatus = async() => {
    const res = await requestGetTransferStatus(transferId)
    if (res.status == 200 && res.data.err == null){
      setRefundFlag(true);
    }
    else {
      setRefundFlag(false);
    }
    setDecodedData(res);
  }
  const sendTx = async () => {
    // request
    const res = await requestGetTransferStatus(transferId)
    if (res.status == 200 && res.data.err == null){
      setRefundFlag(true);
    }
    else {
      setRefundFlag(false);
    }
    setDecodedData(res);
    // already request for refund
    if (res.status ==  200 && res.data.status == 8){
      const inputData = {
        wd_onchain:res.data.wd_onchain,
        sorted_sigs:res.data.sorted_sigs,
        signers:res.data.signers,
        powers:res.data.powers
      }
      const _decodeData = decodeResponse(inputData);
      console.log(_decodeData);
      const calldata = encodeCalldata(_decodeData);
      console.log(calldata);
      // const tx = {
      //   data: calldata,
      //   from: account,
      //   to: toAddress,
      // };
      // const response = await library.getSigner().sendTransaction(tx);
      // txParam.setTxHash(response.hash);
    }

    // const tx = {
    //   data: txParam.calldata,
    //   ...(value ? { value } : {}),
    //   from: account,
    //   to: txParam.toAddress,
    // };
    // const response = await library.getSigner().sendTransaction(tx);
    // txParam.setTxHash(response.hash);
  };
  return (
    <VStack>
      <Box>
        <Input
          placeholder="transferId"
          // maxLength={5000}
          onChange={(e) => {
            setTransferID(e.currentTarget.value);
          }}
          w="1000px"
        />
        <Button
          onClick={RequestGetTransferStatus}
          // isDisabled={!(txParam.calldata && txParam.toAddress)}
        >Search</Button>
        <Button
          onClick={RequestGetTransferStatus}
          isDisabled={!(refundFlag)}
        >Refund</Button>
        <Button
          onClick={sendTx}
          isDisabled={!(refundFlag)}
        >SendTx</Button>
        <Text>{JSON.stringify(decodedData, null, 4)}</Text>
      </Box>
    </VStack>
  );
}