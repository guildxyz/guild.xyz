import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import mutagenABI from "constants/mutagenABI.json"
import useSWR from "swr"
import { RequirementType, Token } from "temporaryData/types"
import useBalance from "./useBalance"
import useContract from "./useContract"
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive"

const getMutagenNfts = async (
  _: string,
  amount: number,
  contract: Contract,
  account: string
) =>
  Promise.all(
    [...Array(amount)].map((_, i) =>
      (async () => {
        const tokenId = await contract.tokenOfOwnerByIndex(account, i)
        // eslint-disable-next-line no-bitwise
        const tokenType = tokenId & 3
        // const url = await contract.tokenURI(tokenId)
        // const data = await fetch(url, { mode: "no-cors" })
        return tokenType
      })()
    )
  )

const useMutagenNfts = (requirementType: RequirementType, token: Token) => {
  const { account } = useWeb3React()
  const amount: any = useBalance(token)
  const contract = useContract(token?.address, mutagenABI)

  const shouldFetch = requirementType === "NFT_HOLD" && !!contract && amount > 0

  /**
   * TODO: deduping doesn't work for some reason. getMutagenNfts get's called 4 times
   * in a row even tho the parameters didn't change
   */
  const { data, mutate } = useSWR(
    shouldFetch ? ["mutagen", parseInt(amount, 10), contract, account] : null,
    getMutagenNfts
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useMutagenNfts
