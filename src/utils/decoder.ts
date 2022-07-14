import { DexRouter__factory, DexRouter } from "../typechain";
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
