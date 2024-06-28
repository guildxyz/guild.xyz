import { GuildCardSkeleton, GuildCardWithLink } from "./GuildCard"
import { atom, useAtomValue } from "jotai"
import { env } from "env"
import useUser from "components/[guild]/hooks/useUser"
import { memo, useEffect, useRef } from "react"
import useSWRInfinite from "swr/infinite"
import { GuildBase } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import { Spinner } from "@phosphor-icons/react"

export const guildQueryAtom = atom("")
const BATCH_SIZE = 24

const GuildCardMemo = memo(GuildCardWithLink)

const GuildCards = ({ guildData }: { guildData?: GuildBase[] }) => {
  if (guildData?.length) {
    return guildData.map((data) => <GuildCardMemo key={data.id} guildData={data} />)
  }
  return Array.from({ length: BATCH_SIZE }, (_, i) => <GuildCardSkeleton key={i} />)
}

const useExploreGuilds = (searchParams: URLSearchParams, guildsInitial: GuildBase[]) => {
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
      const params: Record<string, string> = {
        ...Object.fromEntries(searchParams.entries()),
        offset: (BATCH_SIZE * pageIndex).toString(),
        limit: BATCH_SIZE.toString()
      }
      for (const entry of Object.entries(params)) {
        url.searchParams.set(...entry)
      }

      const urlString = url.pathname + url.search
      if (isSuperAdmin) return [urlString, { method: "GET", body: {} }];
      return urlString
    },
    isSuperAdmin ? fetcherWithSign : options,
    isSuperAdmin ? options : null
  )
}

export const GuildInfiniteScroll = () => {
  const searchParams = new URLSearchParams(useAtomValue(guildQueryAtom))
  const search = searchParams.get('search')
  // const prevSearch = useRef<string | null>();
  const ref = useRef<HTMLElement>(null)
  const { data: filteredGuilds, setSize, isValidating, isLoading } = useExploreGuilds(searchParams, [])
  const renderedGuilds = filteredGuilds?.flat()

  // useEffect(() => {
  //   if (prevSearch.current === search || prevSearch.current === undefined) return
  //   setSize(1)
  //   return () => { prevSearch.current = search }
  // }, [search, setSize])

  useScrollBatchedRendering({
    batchSize: 1,
    scrollTarget: ref,
    disableRendering: isValidating,
    setElementCount: setSize,
    offsetPixel: 420
  })

  if (!renderedGuilds?.length && !isLoading) {
    if (!isValidating && !search?.length) {
      return <div>Can't fetch guilds from the backend right now. Check back later!</div>
    } else {
      return <div>{`No results for ${search}`}</div>
    }
  }

  return (
    <div>
      <section
        className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        ref={ref}
      >
        <GuildCards guildData={renderedGuilds} />
      </section>
      <Spinner className="animate-spin mx-auto size-8 mt-6 invisible data-[active=true]:visible" data-active={isValidating || isLoading} />
    </div>
  )
}
