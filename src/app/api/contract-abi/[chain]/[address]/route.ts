import { Chain } from "@guildxyz/types"
import detectProxy from "evm-proxy-detection"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import { http, Chain as ViemChain, createPublicClient } from "viem"
import { sonic } from "viem/chains"

const ETHERSCAN_API_URLS = {
  SONIC: "https://api.sonicscan.org/api",
} as const satisfies Partial<Record<Chain, string>>

const VIEM_CHAINS = {
  SONIC: sonic,
} as const satisfies Record<keyof typeof ETHERSCAN_API_URLS, ViemChain>

const ETHERSCAN_API_KEYS = {
  SONIC: process.env.SONICSCAN_API_KEY ?? "",
} as const satisfies Record<keyof typeof ETHERSCAN_API_URLS, string>

const isValidChain = (chain: string): chain is keyof typeof ETHERSCAN_API_URLS =>
  Object.keys(ETHERSCAN_API_URLS).includes(chain)

export async function GET(
  _: Request,
  { params }: { params: { chain: string; address: string } }
) {
  if (!isValidChain(params.chain)) {
    return Response.json(
      {
        error: "Invalid param: chain",
      },
      {
        status: 400,
      }
    )
  }

  if (!ADDRESS_REGEX.test(params.address)) {
    return Response.json(
      {
        error: "Invalid param: address",
      },
      {
        status: 400,
      }
    )
  }

  let addressToCheck = params.address

  const client = createPublicClient({
    chain: VIEM_CHAINS[params.chain],
    transport: http(undefined, { batch: true }),
  })

  const result = await detectProxy(
    addressToCheck as `0x${string}`,
    client.request as any
  )

  if (result?.target) {
    addressToCheck = result.target
  }

  const data = await fetch(
    `${ETHERSCAN_API_URLS[params.chain]}?module=contract&action=getabi&address=${addressToCheck}&apikey=${ETHERSCAN_API_KEYS[params.chain]}`
  ).then((res) => res.json())

  if (data.message === "OK")
    return Response.json(JSON.parse(data.result), {
      headers: {
        "Cache-Control": "s-maxage=300", // 5 minutes
      },
    })

  return Response.json(data, { status: 500 })
}
