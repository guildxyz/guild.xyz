import { defaultAbiCoder } from "@ethersproject/abi"
import { BigNumberish } from "@ethersproject/bignumber"
import { BytesLike } from "@ethersproject/bytes"

const encodeParameters = (types: readonly string[], values: readonly any[]) =>
  defaultAbiCoder.encode(types, values)

const encodeWrapEth = (recipient: string, amountMin: BigNumberish) =>
  encodeParameters(["address", "uint256"], [recipient, amountMin])

const encodeUnwrapEth = (recipient: string, amountMin: BigNumberish) =>
  encodeWrapEth(recipient, amountMin)

const encodeV2SwapExactOut = (
  recipient: string,
  amountOut: BigNumberish,
  amountInMax: BigNumberish,
  tokenAddressPath: string[],
  payerIsUser: boolean
) =>
  encodeParameters(
    ["address", "uint256", "uint256", "address[]", "bool"],
    [recipient, amountOut, amountInMax, tokenAddressPath, payerIsUser]
  )

const encodeV3SwapExactOut = (
  recipient: string,
  amountOut: BigNumberish,
  amountInMax: BigNumberish,
  path: BytesLike,
  payerIsUser: boolean
) =>
  encodeParameters(
    ["address", "uint256", "uint256", "bytes", "bool"],
    [recipient, amountOut, amountInMax, path, payerIsUser]
  )

const encodePermit2Permit = (
  tokenAddress: string,
  amount: BigNumberish,
  expiration: BigNumberish,
  nonce: BigNumberish,
  spender: string,
  sigDeadline: BigNumberish,
  data: BytesLike
) =>
  encodeParameters(
    ["address", "uint160", "uint48", "uint48", "address", "uint256", "bytes"],
    [tokenAddress, amount, expiration, nonce, spender, sigDeadline, data]
  )

// https://docs.uniswap.org/contracts/universal-router/technical-reference#command
const UNIVERSAL_ROUTER_COMMANDS = {
  V3_SWAP_EXACT_OUT: "01",
  V2_SWAP_EXACT_OUT: "09",
  PERMIT2_PERMIT: "0a",
  WRAP_ETH: "0b",
  UNWRAP_WETH: "0c",
}

export {
  encodeWrapEth,
  encodeUnwrapEth,
  encodeV2SwapExactOut,
  encodeV3SwapExactOut,
  encodePermit2Permit,
  UNIVERSAL_ROUTER_COMMANDS,
}
