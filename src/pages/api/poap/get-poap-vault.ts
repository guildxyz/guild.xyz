import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Chains, RPC } from "connectors"
import { FEE_COLLECTOR_ADDRESS } from "hooks/useFeeCollectorContract"
import { NextApiRequest, NextApiResponse } from "next"
import FEE_COLLECTOR_ABI from "static/abis/feeCollectorAbi.json"

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

  let poapVault = { id: null, token: null, fee: null }

  try {
    const contractRes = await feeCollectorContract.getVault(vaultId)

    if (!contractRes) poapVault = { id: null, token: null, fee: null }

    poapVault = {
      id: parseInt(vaultId?.toString()),
      token: contractRes.token,
      fee: contractRes.fee?.toHexString(),
    }
  } catch (error) {
    return res.status(500).json({ error })
  }

  if (typeof poapVault.id !== "number")
    return res.status(404).json({ error: "Vault not found" })

  res.json(poapVault)
}

export default handler
