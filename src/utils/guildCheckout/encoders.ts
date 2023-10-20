import { encodeAbiParameters, parseAbiParameters } from "viem"

const encodeParameters = (types: readonly string[], values: readonly unknown[]) =>
  encodeAbiParameters(parseAbiParameters(types.join()), values)

const encodeWrapEth = (recipient: string, amountMin: bigint) =>
  encodeParameters(["address", "uint256"], [recipient, amountMin])

const encodeUnwrapEth = (recipient: string, amountMin: bigint) =>
  encodeWrapEth(recipient, amountMin)

const encodeV2SwapExactOut = (
  recipient: string,
  amountOut: bigint,
  amountInMax: bigint,
  tokenAddressPath: string[],
  payerIsUser: boolean
) =>
  encodeParameters(
    ["address", "uint256", "uint256", "address[]", "bool"],
    [recipient, amountOut, amountInMax, tokenAddressPath, payerIsUser]
  )

const encodeV3SwapExactOut = (
  recipient: string,
  amountOut: bigint,
  amountInMax: bigint,
  path: Uint8Array,
  payerIsUser: boolean
) =>
  encodeParameters(
    ["address", "uint256", "uint256", "bytes", "bool"],
    [recipient, amountOut, amountInMax, path.toString(), payerIsUser]
  )

const encodePermit2Permit = (
  tokenAddress: string,
  amount: bigint,
  expiration: bigint,
  nonce: bigint,
  spender: string,
  sigDeadline: bigint,
  data: Uint8Array
) =>
  encodeParameters(
    ["address", "uint160", "uint48", "uint48", "address", "uint256", "bytes"],
    [tokenAddress, amount, expiration, nonce, spender, sigDeadline, data.toString()]
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
  UNIVERSAL_ROUTER_COMMANDS,
  encodePermit2Permit,
  encodeUnwrapEth,
  encodeV2SwapExactOut,
  encodeV3SwapExactOut,
  encodeWrapEth,
}
