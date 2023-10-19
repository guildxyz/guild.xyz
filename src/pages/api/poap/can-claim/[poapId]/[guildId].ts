import { CHAIN_CONFIG, Chain, Chains } from "connectors"
import { NextApiRequest, NextApiResponse } from "next"
import legacyPoapFeeCollectorAbi from "static/abis/legacyPoapFeeCollector"
import { PoapEventDetails } from "types"
import fetcher from "utils/fetcher"
import { PublicClient, Chain as ViemChain, createPublicClient, http } from "viem"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: `Method ${req.method} is not allowed` })
  }

  const { poapId, guildId } = req.query
  const parsedPoapId = Number(poapId)

  if (isNaN(parsedPoapId))
    return res.status(400).json({ error: "Missing or invalid parameter(s)" })

  const poapLinks = await fetcher(`/v2/guilds/${guildId}/poaps/${poapId}/links`)

  if (!poapLinks) return res.status(404).json({ error: "Couldn't find POAP." })

  if (Object.entries(poapLinks)?.length > 0 && poapLinks.claimed === poapLinks.total)
    return res
      .status(400)
      .json({ error: "There is no more claimable POAP left from this collection." })

  const poapData: PoapEventDetails = await fetcher(
    `/v2/guilds/${guildId}/poaps/${poapId}/event-details`
  )

  if (!poapData)
    return res.status(404).json({ error: "Couldn't fetch POAP event details." })

  const providers: Partial<Record<number, PublicClient>> = {}
  const contracts: Partial<Record<Chain, `0x${string}`>> = {}

  const { contracts: poapContracts } = poapData

  let numOfClaims = 0

  for (const { chainId, vaultId, contract: contractAddress } of poapContracts) {
    if (!providers[chainId])
      providers[chainId] = createPublicClient({
        chain: CHAIN_CONFIG[Chains[chainId]] as ViemChain,
        transport: http(),
      })

    if (!contracts[chainId]) contracts[chainId] = contractAddress

    const vault = await providers[chainId].readContract({
      abi: legacyPoapFeeCollectorAbi,
      address: contracts[chainId],
      functionName: "getVault",
      args: [BigInt(vaultId)],
    })

    if (!vault) res.status(400).json({ error: "Couldn't get vault." })

    const [, , , fee, collected] = vault

    numOfClaims += Number(collected / fee)
  }

  if (numOfClaims >= poapLinks.total)
    return res
      .status(400)
      .json({ error: "There is no more claimable POAP left from this collection." })

  return res.json({ canClaim: true, claimedLinks: numOfClaims })
}

export default handler
