import randomBytes from "randombytes"
import { ValidationMethod } from "types"
import {
  UnauthorizedProviderError,
  createPublicClient,
  keccak256,
  stringToBytes,
  trim,
} from "viem"
import { wagmiConfig } from "wagmiConfig"
import { Chain, Chains, supportedChains } from "wagmiConfig/chains"
import { DEFAULT_MESSAGE } from "./constants"
import { FuelSignProps, MessageParams, SignProps, Validation } from "./types"

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

export const sign = async ({
  walletClient,
  address,
  payload,
  chainId,
  keyPair,
  forcePrompt,
  msg = DEFAULT_MESSAGE,
  ts,
  getMessageToSign = getMessage,
}: SignProps): Promise<[string, Validation]> => {
  const params = createMessageParams(address, ts ?? Date.now(), msg, payload)
  let sig = null

  if (!!keyPair && !forcePrompt) {
    params.method = ValidationMethod.KEYPAIR
    sig = await signWithKeyPair(keyPair, params)
  } else {
    const walletChains = await chainsOfAddressWithDeployedContract(address)
    const walletChainId =
      walletChains.length > 0 ? Chains[walletChains[0]] : undefined

    if (walletChainId) {
      if (walletClient.chain.id !== walletChainId) {
        await walletClient.switchChain({ id: walletChainId })
      }
      params.chainId = `${walletChainId}`
    }

    const isSmartContract = walletChains.length > 0

    params.method = isSmartContract
      ? ValidationMethod.EIP1271
      : ValidationMethod.STANDARD

    params.chainId ||= chainId || `${walletClient.chain.id}`

    if (walletClient?.account?.type === "local") {
      // For local accounts, such as CWaaS, we request the signature on the account. Otherwise it sends a personal_sign to the rpc
      sig = await walletClient.account.signMessage({
        message: getMessageToSign(params),
      })
    } else {
      sig = await walletClient
        .signMessage({
          account: address,
          message: getMessageToSign(params),
        })
        .catch((error) => {
          if (error instanceof UnauthorizedProviderError) {
            throw new Error(
              "Your wallet is not connected. It might be because your browser locked it after a period of time."
            )
          }
          throw error
        })
    }
  }

  return [payload, { params, sig }]
}

export const chainsOfAddressWithDeployedContract = async (
  address: `0x${string}`
): Promise<Chain[]> => {
  const LOCALSTORAGE_KEY = `chainsWithByteCode_${address.toLowerCase()}`
  const chainsWithByteCodeFromLocalstorage = localStorage.getItem(LOCALSTORAGE_KEY)

  if (chainsWithByteCodeFromLocalstorage) {
    const parsed = JSON.parse(chainsWithByteCodeFromLocalstorage)

    if (Array.isArray(parsed))
      return parsed.filter((c) => supportedChains.includes(c))
  }

  const res = await Promise.all(
    wagmiConfig.chains.map(async (chain) => {
      const publicClient = createPublicClient({
        chain,
        transport: wagmiConfig._internal.transports[chain.id],
      })

      const bytecode = await publicClient
        .getBytecode({
          address,
        })
        .catch(() => null)

      return [Chains[chain.id], bytecode && trim(bytecode) !== "0x"] as const
    })
  ).then((results) => [
    ...new Set(
      results
        .filter(([, hasContract]) => !!hasContract)
        .map(([chainName]) => chainName as Chain)
    ),
  ])

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(res))

  return res
}

export const fuelSign = async ({
  wallet,
  address,
  payload,
  keyPair,
  forcePrompt,
  msg = DEFAULT_MESSAGE,
  ts,
}: FuelSignProps): Promise<[string, Validation]> => {
  const params = createMessageParams(address, ts, msg, payload)
  let sig = null

  if (!!keyPair && !forcePrompt) {
    params.method = ValidationMethod.KEYPAIR
    sig = await signWithKeyPair(keyPair, params)
  } else {
    params.method = ValidationMethod.FUEL
    sig = await wallet.signMessage(getMessage(params))
  }

  return [payload, { params, sig }]
}
