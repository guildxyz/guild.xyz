import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider, Provider } from "@ethersproject/providers"
import { Chain, RPC_URLS } from "connectors"
import { NextApiRequest, NextApiResponse } from "next"
import FEE_COLLECTOR_ABI from "static/abis/legacyPoapFeeCollectorAbi.json"
import { PoapEventDetails } from "types"
import fetcher from "utils/fetcher"

type PartialVault = {
  fee: BigNumber
  collected: BigNumber
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: `Method ${req.method} is not allowed` })
  }

  const { poapId } = req.query
  const parsedPoapId = Number(poapId)

  if (isNaN(parsedPoapId))
    return res.status(400).json({ error: "Missing or invalid parameter(s)" })

  const poapLinks = await fetcher(`/assets/poap/links/${poapId}`)

  if (!poapLinks) return res.status(404).json({ error: "Couldn't find POAP." })

  if (Object.entries(poapLinks)?.length > 0 && poapLinks.claimed === poapLinks.total)
    return res
      .status(400)
      .json({ error: "There is no more claimable POAP left from this collection." })

  const poapData: PoapEventDetails = await fetcher(
    `/assets/poap/eventDetails/${poapId}`
  )

  if (!poapData)
    return res.status(404).json({ error: "Couldn't fetch POAP event details." })

  const providers: Partial<Record<Chain, Provider>> = {}
  const contracts: Partial<Record<Chain, Contract>> = {}

  const { contracts: poapContracts } = poapData

  let numOfClaims = 0

  for (const { chainId, vaultId, contract: contractAddress } of poapContracts) {
    if (!providers[chainId])
      providers[chainId] = new JsonRpcProvider(RPC_URLS[chainId][0])

    if (!contracts[chainId])
      contracts[chainId] = new Contract(
        contractAddress,
        FEE_COLLECTOR_ABI,
        providers[chainId]
      )

    const contract = contracts[chainId]

    const vault: PartialVault = await contract?.getVault(vaultId)

    if (!vault) res.status(400).json({ error: "Couldn't get vault." })

    const { fee, collected } = vault

    numOfClaims += collected.div(fee).toNumber()
  }

  if (numOfClaims >= poapLinks.total)
    return res
      .status(400)
      .json({ error: "There is no more claimable POAP left from this collection." })

  // Sending "numOfClaims" here for easier debugging
  return res.json({ canClaim: true, claimedLinks: numOfClaims })
}

export default handler
