import {
  DexRouter__factory,
  DexRouter,
  XBridge__factory,
  XBridge,
} from "../typechain";
import { BigNumber, BytesLike } from "ethers";

export function decodeSmartSwap(calldata: string) {
  const iface = DexRouter__factory.createInterface();
  const params = iface.decodeFunctionData("smartSwap", calldata);
  const { baseRequest, batchesAmount, batches, extraData } = params;
  return {
    baseRequest: baseRequest as DexRouter.BaseRequestStruct,
    batchesAmount: batchesAmount as BigNumber[],
    batches: batches as DexRouter.RouterPathStruct[][],
    extraData: extraData as BytesLike[],
  };
}

export function decodeSwapAndBridgeToImprove(calldata: string) {
  const iface = XBridge__factory.createInterface();
  const params = iface.decodeFunctionData("swapAndBridgeToImprove", calldata);
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

export function decodeBridgeTo(calldata: string) {
  const iface = XBridge__factory.createInterface();
  const params = iface.decodeFunctionData("bridgeTo", calldata);
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

export function decodeClaim(calldata: string) {
  const iface = XBridge__factory.createInterface();
  const params = iface.decodeFunctionData("claim", calldata);
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
  const params = iface.decodeFunctionData("receiveGasToken", calldata);
  const { _request: request } = params;
  return {
    to: request.to,
    amount: request.amount.toString(),
    srcChainId: request.srcChainId.toString(),
    srcTxHash: request.srcTxHash,
    // extData: request.extData,
  };
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
