import { BigNumberish } from "ethers";
import axios from 'axios';
import { base64,Bytes,getAddress,hexlify,BytesLike } from 'ethers/lib/utils';
import {
  CBridgeAdaptor__factory,
  CBridgeAdaptor,
} from "../typechain";
// import { WithdrawReq} from './ts-proto/sgn/cbridge/v1/tx_pb';

enum WithdrawMethodType { 
  WD_METHOD_TYPE_UNDEFINED = 0,
  WD_METHOD_TYPE_ONE_RM = 1,
  WD_METHOD_TYPE_ALL_IN_ONE = 2,
  WD_METHOD_TYPE_STAKING_CLAIM = 3,
}
enum WithdrawType { 
  WITHDRAW_TYPE_REMOVE_LIQUIDITY = 0,
  WITHDRAW_TYPE_REFUND_TRANSFER = 1,
  WITHDRAW_TYPE_CLAIM_FEE_SHARE = 2,
  WITHDRAW_TYPE_VALIDATOR_CLAIM_FEE_SHARE = 3,
}


// export const requestRefund = async (transferId: string, estimatedReceivedAmt: BigNumberish): Promise<any> => {
//     const timestamp = Math.floor(Date.now() / 1000);
//     const withdrawReqProto = new WithdrawReq();
//     withdrawReqProto.setXferId(transferId);
//     withdrawReqProto.setReqId(timestamp);
//     withdrawReqProto.setWithdrawType(WithdrawType.WITHDRAW_TYPE_REFUND_TRANSFER);
  
//     const req = {
//       withdraw_req: base64.encode(withdrawReqProto.serializeBinary() || ''),
//       estimated_received_amt: estimatedReceivedAmt,
//       method_type: WithdrawMethodType.WD_METHOD_TYPE_ALL_IN_ONE
//     };
//     console.log(req);
  
//     return (
//       axios
//         // Replace CBRIDGE_GATEWAY_URL
//         .post(`https://cbridge-prod2.celer.network/v2/withdrawLiquidity`, {
//           ...req
//         })
//         .then((res) => {
//           return res;
//         })
//         .catch((e) => {
//           console.log('Error:', e);
//         })
//     );
//   };
// Replace with your input and uncomment
// requestRefund('A0D1820EAEEEB68A5D57AB2EDC87CB56E7AC3D64D67F0631D668E93D8595A9C1', "6275799373594013");

export const requestGetTransferStatus = async (transferId: string): Promise<any> => {
    const req = {
        transfer_id: transferId
    };

    return (
        axios
        // Replace CBRIDGE_GATEWAY_URL
        .post(`https://cbridge-prod2.celer.network/v2/getTransferStatus`, {
            ...req
        })
        .then((res) => {
            return res;
        })
        .catch((e) => {
            console.log('Error:', e);
        })
    );
};

export const decodeResponse = (response: { wd_onchain: string; sorted_sigs: string[]; signers: string[]; powers: string[]; }) => {
    const res = {
        "wdmsg": hexlify(base64.decode(response.wd_onchain)) as BytesLike,
        "sigs": response.sorted_sigs.map(item => {
        return hexlify(base64.decode(item)) as BytesLike;
        }),
        "signers": response.signers.map(item => {
        const decodeSigners = base64.decode(item);
        const hexlifyObj = hexlify(decodeSigners);
        return getAddress(hexlifyObj) as string;
        }),
        "powers": response.powers.map(item => {
        return hexlify(base64.decode(item)) as BigNumberish;
        }),
    }
    return [res.wdmsg, res.sigs, res.signers, res.powers , "0x241A100333EEfA2efC389Ec836A6fF619fC1c644"];
}

export const encodeCalldata = (aa:any) => {
  const iface = CBridgeAdaptor__factory.createInterface();
  // const params = iface.decodeFunctionData("smartSwap", calldata);
  const calldata = iface.encodeFunctionData("refund", aa);
  return calldata;
}

