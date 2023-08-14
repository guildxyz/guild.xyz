import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { RPC } from "connectors"
import { MYSTERY_BOX_NFT } from "pages/api/leaderboard/mystery-box"
import useSWRImmutable from "swr/immutable"

const fetchIsEligible = async ([, address]) => {
  const provider = new JsonRpcProvider(RPC[MYSTERY_BOX_NFT.chain].rpcUrls[0])
  const contract = new Contract(
    MYSTERY_BOX_NFT.address,
    ["function balanceOf(address owner) view returns (uint)"],
    provider
  )

  const balanceOf = await contract.balanceOf(address)
  return balanceOf.gt(0)
}

const useIsEligibleForMysteryBox = () => {
  const { account } = useWeb3React()

  return useSWRImmutable(
    account ? ["isEligibleForMysteryBox", account] : null,
    fetchIsEligible
  )
}

export default useIsEligibleForMysteryBox
