import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcBatchProvider } from "@ethersproject/providers"
import { Chain, Chains, RPC } from "connectors"
import { getBlockByTime } from "requirements/WalletActivity/hooks/useBlockNumberByTimestamp"
import ERC721_ABI from "static/abis/erc721Abi.json"
import useSWRImmutable from "swr/immutable"

type NftStandard = "ERC-721" | "ERC-1155" | "Unknown"

enum ContractInterface {
  "ERC721" = "0x80ac58cd",
  "ERC1155" = "0xd9b67a26",
}

type NFTDetails = {
  creator: string
  totalMinters: number
  totalMintersToday?: number
  standard: NftStandard
}

const fetchNFTDetails = async ([, chain, address]): Promise<NFTDetails> => {
  const currentDate = new Date()
  currentDate.setUTCHours(0, 0, 0, 0)
  const noonUnixTimestamp = currentDate.getTime() / 1000

  let firstBlockNumberToday

  try {
    firstBlockNumberToday = await getBlockByTime([
      undefined,
      chain,
      noonUnixTimestamp,
    ])
  } catch {}

  const provider = new JsonRpcBatchProvider(RPC[chain].rpcUrls[0], Chains[chain])
  const contract = new Contract(address, ERC721_ABI, provider)

  let firstTotalSupplyToday
  if (!isNaN(Number(firstBlockNumberToday?.result))) {
    firstTotalSupplyToday = await contract.totalSupply({
      blockTag: Number(firstBlockNumberToday.result),
    })
  }

  try {
    const [owner, totalSupply, isERC721, isERC1155] = await Promise.all([
      contract.owner(),
      contract.totalSupply(),
      contract.supportsInterface(ContractInterface.ERC721),
      contract.supportsInterface(ContractInterface.ERC1155),
    ])

    const totalSupplyAsNumber = BigNumber.isBigNumber(totalSupply)
      ? totalSupply.toNumber()
      : 0
    const firstTotalSupplyTodayAsNumber = BigNumber.isBigNumber(
      firstTotalSupplyToday
    )
      ? firstTotalSupplyToday.toNumber()
      : undefined

    return {
      creator: owner?.toLowerCase(),
      totalMinters: totalSupplyAsNumber,
      totalMintersToday: firstTotalSupplyTodayAsNumber
        ? totalSupplyAsNumber - firstTotalSupplyToday
        : undefined,
      standard: isERC1155 ? "ERC-1155" : isERC721 ? "ERC-721" : "Unknown",
    }
  } catch (err) {
    console.log("ARRGH", err)
    return {
      creator: undefined,
      totalMinters: undefined,
      totalMintersToday: undefined,
      standard: undefined,
    }
  }
}

const useNftDetails = (chain: Chain, address: string) => {
  const shouldFetch = Boolean(chain && address)

  return useSWRImmutable<NFTDetails>(
    shouldFetch ? ["nftDetails", chain, address] : null,
    fetchNFTDetails
  )
}

export default useNftDetails
