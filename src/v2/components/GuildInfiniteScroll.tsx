import { GuildCard, GuildCardSkeleton } from "./GuildCard"
import { atom } from "jotai"
import { env } from "env"

export const guildQueryAtom = atom("")

const GuildCards = ({ guildData }: { guildData?: GuildBase[] }) => {
  if (guildData?.length) {
    return guildData.map((data) => <GuildCard key={data.name} guildData={data} />)
  }
  return Array.from({ length: BATCH_SIZE }, (_, i) => <GuildCardSkeleton key={i} />)
}

import useUser from "components/[guild]/hooks/useUser"
import { useEffect, useRef, useState } from "react"
import useSWRInfinite from "swr/infinite"
import { GuildBase } from "types"
import { useFetcherWithSign } from "utils/fetcher"
// import SearchBarFilters, { Filters } from "./SearchBarFilters"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import { Spinner } from "@phosphor-icons/react"

const BATCH_SIZE = 24

const useExploreGuilds = (query: string, guildsInitial: GuildBase[]) => {
  const fetcherWithSign = useFetcherWithSign()
  const { isSuperAdmin } = useUser()

  const options = {
    fallbackData: guildsInitial,
    dedupingInterval: 60000, // one minute
    revalidateFirstPage: false,
  }

  // sending authed request for superAdmins, so they can see unverified & hideFromExplorer guilds too
  return useSWRInfinite<GuildBase[]>(
    (pageIndex, previousPageData) => {
      if (Array.isArray(previousPageData) && previousPageData.length !== BATCH_SIZE)
        return null
      const url = new URL('/v2/guilds', env.NEXT_PUBLIC_API)
      url.searchParams.set('limit', BATCH_SIZE.toString())
      url.searchParams.set('offset', (BATCH_SIZE * pageIndex).toString())

      const urlString = url.pathname + url.search
      if (isSuperAdmin) return [urlString, { method: "GET", body: {} }];
      return urlString
    },
    isSuperAdmin ? fetcherWithSign : options,
    isSuperAdmin ? options : null
  )
}

export const GuildInfiniteScroll = () => {
  // const [search, setSearch] = useQueryState<string>("search", undefined)
  const [search, setSearch] = useState<string>("")
  // const [order, setOrder] = useQueryState<Filters>("order", "FEATURED")
  const [order, setOrder] = useState("FEATURED")

  const prevSearch = ""
  const query = new URLSearchParams({ order, ...(search && { search }) }).toString()
  const ref = useRef<HTMLElement>(null)

  const { data: filteredGuilds, setSize, isValidating, isLoading } = useExploreGuilds(query, [])

  const renderedGuilds = filteredGuilds?.flat()

  useEffect(() => {
    // if (prevSearch === search || prevSearch === undefined) return
    setSize(1)
  }, [search, prevSearch, setSize])

  useScrollBatchedRendering({
    batchSize: 1,
    scrollTarget: ref,
    disableRendering: isValidating,
    setElementCount: setSize,
  })

  if (!isValidating && !renderedGuilds?.length && !search) {
    return <div>
      Can't fetch guilds from the backend right now. Check back later!
    </div>
  }

  return (
    <div>
      <section
        className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        ref={ref}
      >
        <GuildCards guildData={renderedGuilds} />
      </section>
      {<Spinner className="animate-spin mx-auto size-8 mt-6 invisible data-[active=true]:visible" data-active={isValidating || isLoading} />}
    </div>
  )
}
