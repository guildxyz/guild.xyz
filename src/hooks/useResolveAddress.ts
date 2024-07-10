import { createStore, del, get, set } from "idb-keyval"
import { LENS_API_URL } from "requirements/Lens/hooks/useLensProfiles"
import nnsReverseResolveAbi from "static/abis/nnsReverseResolve"
import unsRegistryAbi from "static/abis/unsRegistry"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { PublicClient, createPublicClient } from "viem"
import { mainnet } from "wagmi/chains"
import { wagmiConfig } from "wagmiConfig"
import { Chain, Chains } from "wagmiConfig/chains"

const NNS_REGISTRY = "0x849f92178950f6254db5d16d1ba265e70521ac1b"

type UnstoppableDomainsChains = Extract<Chain, "ETHEREUM" | "POLYGON">
const UNSTOPPABLE_DOMAIN_CONTRACTS: Record<UnstoppableDomainsChains, string> = {
  ETHEREUM: "0x049aba7510f45ba5b64ea9e658e342f904db358d",
  POLYGON: "0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f",
}

type IDBResolvedAddress = { resolvedAddress: string; createdAt: number }
const getStore = () =>
  createStore("resolved-addresses.guild.xyz", "resolvedAddresses")

const getResolvedAddressFromIdb = (address: string) =>
  get<IDBResolvedAddress>(address, getStore())
const setResolvedAddressToIdb = (
  address: string,
  resolvedAddress: IDBResolvedAddress
) => set(address, resolvedAddress, getStore())
const deleteResolvedAddressFromIdb = (address: string) => del(address, getStore())

const fetchENSName = async (address: `0x${string}`): Promise<string> => {
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: wagmiConfig._internal.transports[mainnet.id],
  })

  const ens = await publicClient
    .getEnsName({
      address,
    })
    .catch(() => null)

  if (ens) {
    await setResolvedAddressToIdb(address, {
      resolvedAddress: ens,
      createdAt: Date.now(),
    }).catch(() => {})
  }

  return ens
}

const fetchNNSName = async (address: `0x${string}`): Promise<string> => {
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: wagmiConfig._internal.transports[mainnet.id],
  })

  const nns = await publicClient
    .readContract({
      address: NNS_REGISTRY,
      abi: nnsReverseResolveAbi,
      functionName: "resolve",
      args: [address],
    })
    .catch(() => null)

  if (nns) {
    await setResolvedAddressToIdb(address, {
      resolvedAddress: nns,
      createdAt: Date.now(),
    }).catch(() => {})
  }

  return nns
}

const fetchLensProtocolName = async (address: string): Promise<string> => {
  const lens = await fetcher(LENS_API_URL, {
    method: "POST",
    body: {
      query: `query {
        profiles(request: { where: { ownedBy: ["${address}"] } }) {
          items {
            handle {
              localName
            }
        }}
      }`,
    },
  })
    .then((res) => res?.data?.profiles?.items?.[0]?.handle?.localName)
    .catch(() => null)

  const lensName = lens ? `${lens}.lens` : undefined

  if (lensName) {
    await setResolvedAddressToIdb(address, {
      resolvedAddress: lensName,
      createdAt: Date.now(),
    }).catch(() => {})
  }

  return lensName
}

const fetchSpaceIdName = async (address: string): Promise<string> => {
  const tlds = ["bnb", "arb"]

  const spaceIds = await Promise.all(
    tlds.map((tld) =>
      fetcher(`https://api.prd.space.id/v1/getName?tld=${tld}&address=${address}`)
    )
  )

  const spaceId = spaceIds.find((data) => !!data.name)?.name

  if (spaceId) {
    await setResolvedAddressToIdb(address, {
      resolvedAddress: spaceId,
      createdAt: Date.now(),
    }).catch(() => {})
  }

  return spaceId
}

const fetchDotbitName = async (address: string): Promise<string> => {
  const dotbit = await fetcher("https://indexer-basic.did.id", {
    body: {
      jsonrpc: "2.0",
      id: 1,
      method: "das_reverseRecord",
      params: [
        {
          type: "blockchain",
          key_info: {
            coin_type: "60", // 60: ETH, 195: TRX, 9006: BNB, 966: Matic
            chain_id: "1", // 1: ETH, 56: BSC, 137: Polygon
            key: address,
          },
        },
      ],
    },
  })
    .then((res) => res.result?.data?.account)
    .catch(() => null)

  if (dotbit) {
    await setResolvedAddressToIdb(address, {
      resolvedAddress: dotbit,
      createdAt: Date.now(),
    }).catch(() => {})
  }

  return dotbit
}

const fetchUnstoppableName = async (address: `0x${string}`): Promise<string> => {
  const providers: Partial<Record<UnstoppableDomainsChains, PublicClient>> = {}

  for (const chain of Object.keys(UNSTOPPABLE_DOMAIN_CONTRACTS)) {
    providers[chain] = createPublicClient({
      chain: wagmiConfig.chains.find((c) => Chains[c.id] === chain),
      transport: wagmiConfig._internal.transports[Chains[chain]],
    })
  }

  const unstoppableNames = await Promise.all(
    /**
     * We need to @ts-ignore this line, since we get a "Type instantiation is
     * excessively deep and possibly infinite" error here until strictNullChecks is
     * set to false in our tsconfig. We should set it to true & sort out the related
     * issues in another PR.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Object.values(providers).map((pc) =>
      pc
        .readContract({
          abi: unsRegistryAbi,
          address: UNSTOPPABLE_DOMAIN_CONTRACTS[Chains[pc.chain.id]],
          functionName: "reverseNameOf",
          args: [address],
        })
        .catch(() => null)
    )
  )

  const unstoppable = unstoppableNames?.find((name) => !!name)

  if (unstoppable) {
    await setResolvedAddressToIdb(address, {
      resolvedAddress: unstoppable,
      createdAt: Date.now(),
    }).catch(() => {})
  }

  return unstoppable
}

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24

const fetchDomains = async ([_, account]: [string, `0x${string}`]) => {
  const lowerCaseAddress = account.toLowerCase() as `0x${string}`

  const idbData = await getResolvedAddressFromIdb(lowerCaseAddress).catch(
    () => null as IDBResolvedAddress
  )

  if (idbData?.createdAt > Date.now() - ONE_DAY_IN_MS) {
    return idbData.resolvedAddress
  } else if (!!idbData) {
    await deleteResolvedAddressFromIdb(lowerCaseAddress).catch(() => {})
  } else {
    // If there isn't any data in idb, but we fetched the name during the last 24h, we don't need to fetch it again

    const localStorageKey = `resolveAddressTimestamp-${lowerCaseAddress}`
    const lastFetchedAt = localStorage.getItem(localStorageKey)
    const now = Date.now()

    if (lastFetchedAt) {
      try {
        const shouldFetch = Number(lastFetchedAt) + ONE_DAY_IN_MS < now
        if (!shouldFetch) return null
      } catch {}
    }

    localStorage.setItem(localStorageKey, now.toString())
  }

  // test address: 0xe5358cab95014e2306815743793f16c93a8a5c70 - nnsregistry.⌐◨-◨
  const nns = await fetchNNSName(lowerCaseAddress)
  if (nns) return nns

  // test address: 0x5df52E6B70F25919Ad29add390EFE2614f91b2C6 - not.eth
  const ens = await fetchENSName(lowerCaseAddress)
  if (ens) return ens

  // test address: 0xe055721b972d58f0bcf6370c357879fb3a37d2f3 - ladidaix.eth
  const lens = await fetchLensProtocolName(lowerCaseAddress)
  if (lens) return lens

  // test address: 0x2e552e3ad9f7446e9cab378c008315e0c26c0398 - allen.bnb / 0x5206.arb
  const spaceId = await fetchSpaceIdName(lowerCaseAddress)
  if (spaceId) return spaceId

  // test address: 0x94ef5300cbc0aa600a821ccbc561b057e456ab23 - sandy.nft
  const unstoppableDomain = await fetchUnstoppableName(lowerCaseAddress)
  if (unstoppableDomain) return unstoppableDomain

  // test address: 0x1d643fac9a463c9d544506006a6348c234da485f - jeffx.bit
  const dotbit = await fetchDotbitName(lowerCaseAddress)
  if (dotbit) return dotbit

  return null
}

const useResolveAddress = (accountParam: string): string => {
  const shouldFetch = typeof window !== "undefined" && !!accountParam
  const { data } = useSWRImmutable(
    shouldFetch ? ["domain", accountParam as `0x${string}`] : null,
    fetchDomains
  )

  return data
}

export default useResolveAddress
