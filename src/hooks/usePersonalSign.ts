import { keccak256 } from "@ethersproject/keccak256"
import type { Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { useWeb3React } from "@web3-react/core"
import { randomBytes } from "crypto"
import { useState } from "react"

export type Validation = {
  address: string
  addressSignedMessage: string
  nonce: string
  random: string
  hash: string
  timestamp: string
}

const sign = async ({
  library,
  address,
  payload,
}: {
  library: Web3Provider
  address: string
  payload: any
}): Promise<Validation> => {
  const random = randomBytes(32).toString("base64")
  const nonce = keccak256(toUtf8Bytes(`${address}${random}`))
  const hash = Object.keys(payload).length > 0 ? keccak256(toUtf8Bytes(payload)) : ""
  const timestamp = new Date().getTime().toString()

  const addressSignedMessage = await library
    .getSigner(address)
    .signMessage(
      `Please sign this message to verify your request! Nonce: ${nonce} Random: ${random} Hash: ${hash} Timestamp: ${timestamp}`
    )

  return { address, addressSignedMessage, nonce, random, hash, timestamp }
}

const usePersonalSign = () => {
  const { library, account } = useWeb3React<Web3Provider>()
  const [error, setError] = useState(null)
  const [isSigning, setIsSigning] = useState<boolean>(false)

  const removeError = () => setError(null)

  const callbackWithSign = async (callback, payload) => {
    setIsSigning(true)
    const validation = await sign({ library, address: account, payload })
      .catch(setError)
      .finally(() => setIsSigning(false))
    return (props) => callback(props, { validation, payload })
  }

  return {
    isSigning,
    callbackWithSign,
    error,
    removeError,
  }
}

export default usePersonalSign
