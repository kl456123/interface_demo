import {
  DexRouter__factory,
  DexRouter,
  XBridge__factory,
  XBridge,
} from "../typechain";
import { BigNumber, BytesLike, ethers} from "ethers";

export function decodeSmartSwap(calldata: string) {
  const iface = DexRouter__factory.createInterface();
  const functionName = "smartSwap";
  const params = iface.decodeFunctionData(functionName, calldata);
  const { baseRequest, batchesAmount, batches, extraData } = params;
  return {
    baseRequest: baseRequest as DexRouter.BaseRequestStruct,
    batchesAmount: batchesAmount as BigNumber[],
    batches: batches as DexRouter.RouterPathStruct[][],
    extraData: extraData as BytesLike[],
  };
}

export function decodeSmartSwapBridge(calldata: string) {
  return decodeSmartSwap(calldata.replace("0xe051c6e8","0xce8c4316"));
}

export function decodeUnxswap(calldata: string) {
  const iface = DexRouter__factory.createInterface();
  const functionName = "unxswap";
  const params = iface.decodeFunctionData(functionName, calldata);
  const { srcToken, amount, minReturn, pools } = params;
  return {
    srcToken,
    amount,
    minReturn,
    pools: pools as BytesLike[],
  };
}

export function decodeUnxswapBridge(calldata: string) {
  return decodeUnxswap(calldata.replace("0xd6576868","0xa6497e5c"));
}

export function decodeSwapAndBridgeToImprove(calldata: string) {
  const iface = XBridge__factory.createInterface();
  const functionName = "swapAndBridgeToImprove";
  const params = iface.decodeFunctionData(functionName, calldata);
  const { _request: request } = params;
  return {
    fromToken: request.fromToken as string,
    toToken: request.toToken as string,
    to: request.to as string,
    adaptorId: request.adaptorId.toString(),
    toChainId: request.toChainId.toString(),
    fromTokenAmount: request.fromTokenAmount.toString(),
    toTokenMinAmount: request.toTokenMinAmount.toString(),
    toChainToTokenMinAmount: request.toChainToTokenMinAmount.toString(),
    // data: request.data,
    // dexData: request.dexData,
  };
}

export function decodeSwapBridgeToV2(calldata: string) {
  const iface = XBridge__factory.createInterface();
  const functionName = "swapBridgeToV2";
  const params = iface.decodeFunctionData(functionName, calldata);
  const { _request: request } = params;
  // console.log(request.dexData.toString().slice(0, 10) == "0xce8c4316" ? decodeSmartSwap(request.dexData.toString()):decodeUnxswap(request.dexData.toString())); 
  return {
    function: functionName,
    fromToken: request.fromToken as string,
    toToken: request.toToken as string,
    to: request.to as string,
    adaptorId: request.adaptorId.toString(),
    toChainId: {
      source: request.toChainId.toString(),
      decode: decodeToChainId(request.toChainId.toString()),
    },
    fromTokenAmount: request.fromTokenAmount.toString(),
    toTokenMinAmount: request.toTokenMinAmount.toString(),
    toChainToTokenMinAmount: request.toChainToTokenMinAmount.toString(),
    data: {
      source: request.data.toString(),
      decode: decodeBridgeData(request.adaptorId.toString(), request.data.toString())
    },
    dexData: request.dexData.toString().slice(0, 10) == "0xe051c6e8" ? decodeSmartSwapBridge(request.dexData.toString()):decodeUnxswapBridge(request.dexData.toString()), 
    extData: request.extData.toString(),
  };
}

export function decodeBridgeTo(calldata: string) {
  const iface = XBridge__factory.createInterface();
  const functionName = "bridgeTo";
  const params = iface.decodeFunctionData(functionName, calldata);
  const { _request: request } = params;
  return {
    adaptorId: request.adaptorId.toString(),
    to: request.to,
    token: request.token,
    toChainId: request.toChainId.toString(),
    amount: request.amount.toString(),
    data: request.data.toString(),
  };
}

export function decodeBridgeToV2(calldata: string) {
  const iface = XBridge__factory.createInterface();
  const functionName = "bridgeToV2";
  const params = iface.decodeFunctionData(functionName, calldata);
  const { _request: request } = params;
  return {
    adaptorId: request.adaptorId.toString(),
    to: request.to,
    token: request.token,
    toChainId: {
      source: request.toChainId.toString(),
      decode: decodeToChainId(request.toChainId.toString()),
    },
    amount: request.amount.toString(),
    data: {
      source: request.data.toString(),
      decode: decodeBridgeData(request.adaptorId.toString(), request.data.toString())
    },
    extData: request.extData.toString(),
  };
}

export function decodeClaim(calldata: string) {
  const iface = XBridge__factory.createInterface();
  const functionName = "claim";
  const params = iface.decodeFunctionData(functionName, calldata);
  const { _request: request } = params;
  return {
    fromToken: request.fromToken,
    toToken: request.toToken,
    to: request.to,
    amount: request.amount.toString(),
    gasFeeAmount: request.gasFeeAmount.toString(),
    srcChainId: request.srcChainId.toString(),
    srcTxHash: request.srcTxHash,
    // dexData: request.dexData,
    // extData: request.extData,
  };
}

export function decodeReceiveGasToken(calldata: string) {
  const iface = XBridge__factory.createInterface();
  const functionName = "receiveGasToken";
  const params = iface.decodeFunctionData(functionName, calldata);
  const { _request: request } = params;
  return {
    to: request.to,
    amount: request.amount.toString(),
    srcChainId: request.srcChainId.toString(),
    srcTxHash: request.srcTxHash,
    // extData: request.extData,
  };
}

///

export function decodeBridgeData(adapterId: string, data: string) {
  const abi = new ethers.utils.AbiCoder();
  switch(adapterId){
    case "1" : { // anyswap
      const decodeData = abi.decode(['address', 'address'], data)
      const res = {
        routerAddress: decodeData[0],
        anyTokenAddress: decodeData[1],
      };
      return res;
    }
    case "2" : { //cbridge
      const decodeData = abi.decode(['address', 'uint64', 'uint32'], data)
      const res = { 
        routerAddress: decodeData[0],
        nonce: decodeData[1],
        maxSlippage: decodeData[2],
      };
      return res;
    }
    case "3" : { //swft
      const decodeData = abi.decode(['address', 'string', 'string', 'uint256'], data)
      const res = {
        routerAddress: decodeData[0],
        toToken: decodeData[1],
        destination: decodeData[2],
        minReturnAmount: decodeData[3],
      };
      return res;
    }
  }
}

export function decodeToChainId(toChainId: string) {
  const hexToChainId = BigInt(toChainId).toString(16);
  const _length = hexToChainId.length
  const res = {
    orderId: "0x" + hexToChainId.toString().substring(0 ,_length - 8 - 40),
    receviceGasAmount: "0x" + hexToChainId.toString().substring(_length - 8 - 40,_length -8),
    toChainID: "0x" + hexToChainId.toString().substring(_length - 8,_length)
  }
  return res
}

export function decodeRoutePath(
  batches: DexRouter.RouterPathStruct[][],
  batchesAmount: BigNumber[]
) {
  const resultStr: string[] = [];
  for (let i = 0; i < batchesAmount.length; ++i) {
    const amount = batchesAmount[i];
    const perPathStr = [amount.toString() + ": "];
    for (let j = 0; j < batches[i].length; ++j) {
      perPathStr.push(
        `token[${batches[i][j].fromToken}]-pool[${batches[i][j].assetTo}]`
      );
    }
    resultStr.push(perPathStr.join("-"));
  }
  return resultStr.join("\n");
}
