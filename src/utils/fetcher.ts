import { keccak256 } from "@ethersproject/keccak256"
import type { Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { randomBytes } from "crypto"
import stringify from "fast-json-stable-stringify"
import { mutate } from "swr"

export type Validation = {
  address: string
  addressSignedMessage: string
  nonce: string
  random: string
  hash?: string
  timestamp: string
}

const sign = async ({
  library,
  address,
  payload,
  replacer,
}: {
  library: Web3Provider
  address: string
  payload: any
  replacer?: (payload: any) => any
}): Promise<Validation> => {
  const random = randomBytes(32).toString("base64")
  const nonce = keccak256(toUtf8Bytes(`${address.toLowerCase()}${random}`))
  const finalPayload = replacer
    ? JSON.parse(JSON.stringify(payload, replacer))
    : payload
  const hash =
    Object.keys(finalPayload).length > 0
      ? keccak256(toUtf8Bytes(stringify(finalPayload)))
      : ""
  const timestamp = new Date().getTime().toString()

  const addressSignedMessage = await library
    .getSigner(address.toLowerCase())
    .signMessage(
      `Please sign this message to verify your request!\nNonce: ${nonce}\nRandom: ${random}\n${
        hash ? `Hash: ${hash}\n` : ""
      }Timestamp: ${timestamp}`
    )

  return {
    address: address.toLowerCase(),
    addressSignedMessage,
    nonce,
    random,
    ...(hash.length > 0 ? { hash } : {}),
    timestamp,
  }
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
    ? await mutate("isSigning", true, { revalidate: false })
        .then(() => sign({ ...validationData, payload, replacer: init.replacer }))
        .finally(() => mutate("isSigning", false, { revalidate: false }))
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

  return fetch(`${api}${resource}`, options).then(async (response: Response) => {
    const res = response.json?.()

    return response.ok ? res : Promise.reject(res)
  })
}

export default fetcher
