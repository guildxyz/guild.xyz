import type { NeynarAPIClient } from "@neynar/nodejs-sdk"
import { BareFetcher, SWRConfiguration } from "swr"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { NEYNAR_BASE_URL, NEYNAR_DEFAULT_HEADERS } from "./constants"

type SupportedNeynarTypes = Extract<
  keyof NeynarAPIClient,
  `lookUp${string}` | `lookup${string}` | `search${string}` | `fetch${string}`
>

const fetcherForFarcaster = (path: `/${string}`) =>
  fetcher(`${NEYNAR_BASE_URL}${path}`, {
    headers: NEYNAR_DEFAULT_HEADERS,
  })

export const useFarcasterAPI = <
  Data extends Awaited<ReturnType<NeynarAPIClient[SupportedNeynarTypes]>>,
>(
  key: `/${string}` | null,
  config?: SWRConfiguration<Data>
) => useSWRImmutable<Data>(key, fetcherForFarcaster as BareFetcher<Data>, config)
