import { GuildCard, GuildCardSkeleton } from "./GuildCard"
import { atom } from "jotai"
export const guildQueryAtom = atom("")
const GuildCards = ({ guildData }: { guildData?: GuildBase[] }) => {
  if (guildData?.length) {
    return guildData.map((data) => <GuildCard key={data.name} guildData={data} />)
  }
  return Array.from({ length: BATCH_SIZE }, (_, i) => <GuildCardSkeleton key={i} />)
}
// const getKey = (pageIndex: number) => {
//   const request = new URL('/v2/guilds', env.NEXT_PUBLIC_API)
//   request.searchParams.set('offset', (pageIndex * BATCH_SIZE).toString())
//   request.searchParams.set('limit', BATCH_SIZE.toString())
//   return request.href;
// }
//
// const fetcher = async (url: string) => (await fetch(url)).json()
//
// export const GuildInfiniteScroll = () => {
//   const { data: guildData, size, setSize, isLoading } = useSWRInfinite<GuildBase>(getKey, fetcher, { parallel: true })
//
//   return <section className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//     <GuildCards guildData={guildData?.flat()} />
//   </section>
// }

import useUser from "components/[guild]/hooks/useUser"
import { useEffect, useRef, useState } from "react"
import useSWRInfinite from "swr/infinite"
import { GuildBase } from "types"
import { useFetcherWithSign } from "utils/fetcher"
// import SearchBarFilters, { Filters } from "./SearchBarFilters"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"

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
  return useSWRInfinite<GuildBase>(
    (pageIndex, previousPageData) => {
      if (Array.isArray(previousPageData) && previousPageData.length !== BATCH_SIZE)
        return null

      const url = `/v2/guilds?${query}&limit=${BATCH_SIZE}&offset=${
        pageIndex * BATCH_SIZE
      }`

      if (isSuperAdmin) return [url, { method: "GET", body: {} }]
      return url
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

  const { data: filteredGuilds, setSize, isValidating } = useExploreGuilds(query, [])

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

  return (
    <section
      className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      ref={ref}
    >
      <GuildCards guildData={renderedGuilds} />
    </section>
  )
}

// {!renderedGuilds?.length ? (
//   isValidating ? null : !search?.length ? (
//     <div>
//       Can't fetch guilds from the backend right now. Check back later!
//     </div>
//   ) : (
//     <div>{`No results for ${search}`}</div>
//   )
// ) : (
//   <div>
//     {renderedGuilds.map((guild) => (
//       <GuildCard guildData={guild} key={guild.name} />
//     ))}
//   </div>
// )}
