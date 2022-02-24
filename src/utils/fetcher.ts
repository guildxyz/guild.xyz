import { keccak256 } from "@ethersproject/keccak256"
import type { Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { randomBytes } from "crypto"
import { mutate } from "swr"

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

const fetcher = async (
  resource: string,
  { body, validationData, ...init }: Record<string, any> = {}
) => {
  const api =
    !resource.startsWith("http") && !resource.startsWith("/api")
      ? process.env.NEXT_PUBLIC_API
      : ""

  const payload = body ?? {}

  const validation = validationData
    ? await mutate("isSigning", true)
        .then(() => sign({ ...validationData, payload }))
        .finally(() => mutate("isSigning", false))
    : null

  const options = {
    ...(body
      ? {
          method: "POST",
          body: validation
            ? JSON.stringify(
                {
                  payload,
                  validation,
                },
                init.replacer
              )
            : JSON.stringify({ payload }, init.replacer),
        }
      : {}),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  }

  console.log(`${api}${resource}`)
  console.log("options", options)

  return fetch(`${api}${resource}`, options).then(async (response: Response) => {
    const res = response.json?.()

    return response.ok ? res : Promise.reject(res)
  })
}

export default fetcher
