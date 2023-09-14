import { formatUnits } from "@ethersproject/units"
import { Chains, RPC } from "connectors"
import { NextApiRequest, NextApiResponse } from "next"
import { Guild } from "types"
import fetcher from "utils/fetcher"

type GetVaultResponse = {
  eventId: number
  owner: string
  token: string
  fee: string
  collected: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { guildId, poapId } = req.query

  if (!guildId || !poapId)
    return res.status(400).json({ error: "Missing parameters" })

  const guild: Guild = await fetcher(`/v2/guilds/${guildId}`).catch((_) => ({}))

  if (!guild.id) return res.status(404).json({ error: "Guild not found." })

  const guildPoaps: Guild["poaps"] = await fetcher(
    `/v2/guilds/${guildId}/poaps`
  ).catch((_) => ({}))

  const poap = guildPoaps?.find((p) => p.id.toString() === poapId)

  if (!poap) return res.status(404).json({ error: "POAP not found." })

  if (!poap.poapContracts?.length) return res.json([])

  const withdrawableAmountsPromises = []

  for (const poapContract of poap.poapContracts) {
    withdrawableAmountsPromises.push(
      fetcher(
        `${req.headers.host.includes("localhost") ? "http://" : "https://"}${
          req.headers.host
        }/api/poap/get-vault/${poapContract.vaultId}/${poapContract.chainId}`
      ).then(async (data: GetVaultResponse) => {
        const tokenData = await fetcher(
          `/v2/util/chains/${Chains[poapContract.chainId]}/contracts/${
            data.token
          }/symbol`
        )
        const decimals =
          data.token === "0x0000000000000000000000000000000000000000"
            ? 18
            : tokenData.decimals

        const symbol =
          data.token === "0x0000000000000000000000000000000000000000"
            ? RPC[Chains[poapContract.chainId]].nativeCurrency.symbol
            : tokenData.symbol

        return {
          id: poapContract.id,
          chainId: poapContract.chainId,
          vaultId: poapContract.vaultId,
          tokenSymbol: symbol,
          collected: parseFloat(formatUnits(data.collected, decimals ?? 18)),
        }
      })
    )
  }

  const response = await Promise.all(withdrawableAmountsPromises)

  return res.json(response)
}

export default handler
