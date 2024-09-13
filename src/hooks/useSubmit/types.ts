import { Account } from "fuels"
import { ValidationMethod } from "types"
import { PublicClient, WalletClient } from "viem"

type SignBaseProps = {
  address: `0x${string}`
  payload: string
  chainId?: string
  forcePrompt: boolean
  keyPair?: CryptoKeyPair
  msg?: string
  ts?: number
  getMessageToSign?: (params: MessageParams) => string
}

export type SignProps = SignBaseProps & {
  publicClient: PublicClient
  walletClient: WalletClient
}

export type FuelSignProps = SignBaseProps & { wallet: Account }

export type SignedValidation = { signedPayload: string; validation: Validation }

export type Validation = {
  params: MessageParams
  sig: string
}

export type MessageParams = {
  msg: string
  addr: string
  method: ValidationMethod
  chainId?: string
  hash?: string
  nonce: string
  ts: string
}

export type UseSubmitOptions<ResponseType = void> = {
  onSuccess?: (response: ResponseType) => void
  onError?: (error: any) => void
  onOptimistic?: (response: Promise<ResponseType>, payload: any) => void

  // Use catefully! If this is set to true, a .onSubmit() call can reject!
  allowThrow?: boolean
}
