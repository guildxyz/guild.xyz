import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import { useRouter } from "next/router"
import useSWR from "swr"
import { communities, Community } from "temporaryData/communities"
import tokens from "temporaryData/tokens"
import { ProvidedCommunity } from "temporaryData/types"

const fetchCommunityData = async (_: string, urlName: string, chainId: number) => {
  // Set this to true if you don't want the data to be fetched from backend
  const DEBUG = false

  const localData =
    communities.find((i) => i.urlName === urlName) ??
    tokens.find((i) => i.urlName === urlName)

  const communityData: Community =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetch(
          `${process.env.NEXT_PUBLIC_API}/community/urlName/${urlName}`
        ).then((response: Response) => (response.ok ? response.json() : localData))

  const chainData =
    communityData.chainData.find((chain) => chain.name === Chains[chainId]) ??
    communityData.chainData[0]

  const availableChains = communityData.chainData.map((chain) => chain.name) ?? []

  if (!communityData) throw new Error()

  return {
    ...communityData,
    chainData,
    availableChains,
  }
}

const useCommunityData = (): {
  communityData: ProvidedCommunity
  mutateCommunityData: any
} => {
  const router = useRouter()
  const { chainId } = useWeb3React()

  const shouldFetch =
    typeof router.query.community?.toString() === "string" &&
    router.query.community.toString().length > 0 &&
    typeof chainId === "number"

  const { data: communityData, mutate: mutateCommunityData } = useSWR(
    shouldFetch ? ["community", router.query.community.toString(), chainId] : null,
    fetchCommunityData,
    {
      revalidateOnFocus: false,
      onError: () => router.push("/404"),
    }
  )

  return { communityData, mutateCommunityData }
}

export default useCommunityData
