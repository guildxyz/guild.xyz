import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Chains, RPC } from "connectors"
import { FEE_COLLECTOR_ADDRESS } from "hooks/useFeeCollectorContract"
import { NextApiRequest, NextApiResponse } from "next"
import FEE_COLLECTOR_ABI from "static/abis/legacyPoapFeeCollectorAbi.json"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { vaultId, chainId } = req.query

  if (!vaultId || !chainId)
    return res.status(400).json({ error: "Missing parameters" })

  const provider = new JsonRpcProvider(RPC[Chains[+chainId]]?.rpcUrls?.[0])
  const feeCollectorContract = new Contract(
    FEE_COLLECTOR_ADDRESS,
    FEE_COLLECTOR_ABI,
    provider
  )

  if (!provider || !feeCollectorContract)
    return res.status(500).json({ error: "Provider/contract error" })

  let vault = {
    eventId: null,
    owner: null,
    token: null,
    fee: null,
    collected: null,
  }

  try {
    vault = await feeCollectorContract
      .getVault(vaultId)
      .then((contractCallRes) => {
        const [rawEventId, owner, token, fee, collected] = contractCallRes
        const eventId = parseInt(rawEventId?.toString())

        return {
          eventId,
          owner,
          token,
          fee: fee?.toHexString(),
          collected: collected?.toHexString(),
        }
      })
      .catch((_) => ({
        eventId: null,
        owner: null,
        token: null,
        fee: null,
        collected: null,
      }))
  } catch (error) {
    return res.status(500).json({ error })
  }

  if (typeof vault.owner !== "string")
    return res.status(404).json({ error: "Vault not found" })

  res.json(vault)
}

export default handler
