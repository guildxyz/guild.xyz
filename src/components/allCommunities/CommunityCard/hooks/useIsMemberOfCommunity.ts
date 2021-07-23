import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useSWR from "swr"

const getJoinedCommunities = async (
  _: string,
  address: string
): Promise<Array<number>> =>
  fetch(`${process.env.NEXT_PUBLIC_API}/getUserMembership/${address}`).then(
    (response) => {
      if (response.ok) {
        return response.json().then((data) => data.communities)
      }
      return []
    }
  )

const useIsMemberOfCommunity = (): boolean => {
  const { id } = useCommunity()
  const { account } = useWeb3React()
  const { data: joinedCommunitites } = useSWR(
    ["joined_communities", account],
    getJoinedCommunities
  )

  return joinedCommunitites?.includes(id)
}

export default useIsMemberOfCommunity
