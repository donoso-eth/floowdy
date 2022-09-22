import { HardhatRuntimeEnvironment } from "hardhat/types";


/* eslint-disable @typescript-eslint/naming-convention */
export enum Module {
  RESOLVER,
  TIME,
  PROXY,
  SINGLE_EXEC,
}

export type ModuleData = {
  modules: Module[];
  args: string[];
};

export const encodeResolverArgs = (
  hre:HardhatRuntimeEnvironment,
  resolverAddress: string,
  resolverData: string
): string => {
  const encoded = hre.ethers.utils.defaultAbiCoder.encode(
    ["address", "bytes"],
    [resolverAddress, resolverData]
  );

  return encoded;
};

export const encodeTimeArgs = (hre:HardhatRuntimeEnvironment,startTime: number, interval: number): string => {
  const encoded = hre.ethers.utils.defaultAbiCoder.encode(
    ["uint128", "uint128"],
    [startTime, interval]
  );

  return encoded;
};