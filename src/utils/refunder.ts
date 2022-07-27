import { BigNumberish } from "ethers";
import axios from 'axios';
import { base64,Bytes,getAddress,hexlify,BytesLike } from 'ethers/lib/utils';
import {
  CBridgeAdaptor__factory,
  CBridgeAdaptor,
} from "../typechain";
import internal from "stream";
import { format } from "path";
import { Switch } from "@chakra-ui/react";
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

const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;
const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;

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

export const requestRefund = async (transferId: string, estimatedReceivedAmt: BigNumberish): Promise<any> => {


    const url = `${SERVER_HOST}:${SERVER_PORT}/Cbridge/Refund?transferId=${transferId.toString()}&amount=${estimatedReceivedAmt.toString()}`;
    console.log(url);
    return (
      axios
        // Replace CBRIDGE_GATEWAY_URL
        .get(url)
        .then((res) => {
          return res;
        })
        .catch((e) => {
          console.log('Error:', e);
        })
    );
  };

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
    return [res.wdmsg, res.sigs, res.signers, res.powers];
}

export const encodeTx = (inputData:any, chainId: String, fromAddress: String) => {
  const iface = CBridgeAdaptor__factory.createInterface();
  // const params = iface.decodeFunctionData("smartSwap", calldata);
  let toAddress;
  let cbridgeRouterAddress;
  chainId = chainId.toString()
  switch (chainId) {
    case "1":
      toAddress = "0xA2Bc19eEC3355E0cFc73645555bbF19bE55C4F93";
      cbridgeRouterAddress = "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820";
      break;
    case "56":
      toAddress = "0x8D4F3956f3216229B8c1c8f8AFc4aA7130aB3114";
      cbridgeRouterAddress = "0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF";
      break;
    case "66":
      toAddress = "0x350b44e3d05DcCbBe99AC159eEb6EDb82291721a";
      cbridgeRouterAddress = "0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98";
      break;
    case "137":
      toAddress = "0x0125F67642828d294A268fc180b3b94C5333af94";
      cbridgeRouterAddress = "0x88DCDC47D2f83a99CF0000FDF667A468bB958a78";
      break;
    case "10":
      toAddress = "0xD193b24CfE3e07Ef43e1Baa7d158937B1C829ecC";
      cbridgeRouterAddress = "0x9D39Fc627A6d9d9F8C831c16995b209548cc3401";
      break;
    case "43114":
      toAddress = "0xD193b24CfE3e07Ef43e1Baa7d158937B1C829ecC";
      cbridgeRouterAddress = "0xef3c714c9425a8F3697A9C969Dc1af30ba82e5d4";
      break;
    case "42161":
      toAddress = "0x2Db6B8257215Ee9a751f8eDaD5E85df1b414b4Fd";
      cbridgeRouterAddress = "0x1619DE6B6B20eD217a58d00f37B9d47C7663feca";
      break;
    case "250":
      toAddress = "0xBE1BCB60832Cda04b2bd1236B26556452ab11e86";
      cbridgeRouterAddress = "0x374B8a9f3eC5eB2D97ECA84Ea27aCa45aa1C57EF";
      break;
  }
  inputData.push(cbridgeRouterAddress);
  const calldata = iface.encodeFunctionData("refund", inputData);
  const tx = {
    data:calldata,
    from:fromAddress,
    to:toAddress
  }
  return tx;
}

