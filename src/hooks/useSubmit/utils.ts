import randomBytes from "randombytes"
import { keccak256, stringToBytes } from "viem"
import { MessageParams } from "./types"

export const signWithKeyPair = (keyPair: CryptoKeyPair, params: MessageParams) =>
  window.crypto.subtle
    .sign(
      { name: "ECDSA", hash: "SHA-512" },
      keyPair.privateKey,
      Buffer.from(getMessage(params))
    )
    .then((signatureBuffer) => Buffer.from(signatureBuffer).toString("hex"))

export const getMessage = ({
  msg,
  addr,
  method,
  chainId,
  hash,
  nonce,
  ts,
}: MessageParams) =>
  `${msg}\n\nAddress: ${addr}\nMethod: ${method}${
    chainId ? `\nChainId: ${chainId}` : ""
  }${hash ? `\nHash: ${hash}` : ""}\nNonce: ${nonce}\nTimestamp: ${ts}`

export const createMessageParams = (
  address: `0x${string}`,
  ts: number,
  msg: string,
  payload: string
): MessageParams => ({
  addr: address.toLowerCase(),
  nonce: randomBytes(32).toString("hex"),
  ts: ts.toString(),
  hash: payload !== "{}" ? keccak256(stringToBytes(payload)) : undefined,
  method: null,
  msg,
  chainId: undefined,
})
