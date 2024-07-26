import { ValidationMethod } from "types"
import { DEFAULT_MESSAGE } from "./constants"
import { FuelSignProps, Validation } from "./types"
import { createMessageParams, getMessage, signWithKeyPair } from "./utils"

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
