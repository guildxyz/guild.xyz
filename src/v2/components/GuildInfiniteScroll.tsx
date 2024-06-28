import { GuildCard, GuildCardSkeleton } from "./GuildCard"
import { atom, useAtomValue } from "jotai"
import { env } from "env"
import useUser from "components/[guild]/hooks/useUser"
import { memo, useRef } from "react"
import useSWRInfinite from "swr/infinite"
import { GuildBase } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import { Spinner } from "@phosphor-icons/react"

export const guildQueryAtom = atom("")
const BATCH_SIZE = 24

// const GuildCards = memo(({ guildData }: { guildData?: GuildBase[] }) => {
//   if (guildData?.length) {
//     return guildData.map((data) => <GuildCard key={data.name} guildData={data} />)
//   }
//   return Array.from({ length: BATCH_SIZE }, (_, i) => <GuildCardSkeleton key={i} />)
// })

const GuildCardMemo = memo(GuildCard)

const useExploreGuilds = (query: string, guildsInitial: GuildBase[]) => {
  const fetcherWithSign = useFetcherWithSign()
  const { isSuperAdmin } = useUser()
  const searchParams = useAtomValue(guildQueryAtom)

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
      const queryParams = new URLSearchParams(searchParams)
      const params: Record<string, string> = {
        ...Object.fromEntries(queryParams.entries()),
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
  // const [search, setSearch] = useQueryState<string>("search", undefined)
  // const [search, setSearch] = useState<string>("")
  // const [order, setOrder] = useQueryState<Filters>("order", "FEATURED")
  // const [order, setOrder] = useState("FEATURED")

  // const prevSearch = ""
  // const query = new URLSearchParams({ order, ...(search && { search }) }).toString()
  const ref = useRef<HTMLElement>(null)

  const { data: filteredGuilds, setSize, isValidating, isLoading } = useExploreGuilds('', [])

  const renderedGuilds = filteredGuilds?.flat()

  // useEffect(() => {
  //   // if (prevSearch === search || prevSearch === undefined) return
  //   setSize(1)
  // }, [search, prevSearch, setSize])

  useScrollBatchedRendering({
    batchSize: 1,
    scrollTarget: ref,
    disableRendering: isValidating,
    setElementCount: setSize,
    offsetPixel: 420
  })

  // if (!isValidating && !renderedGuilds?.length) {
  //   return <div>
  //     Can't fetch guilds from the backend right now. Check back later!
  //   </div>
  // }

  return (
    <div>
      <section
        className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        ref={ref}
      >
        {
          renderedGuilds?.map((guild) => <GuildCardMemo guildData={guild} key={guild.name} />)
        }
      </section>
      <Spinner className="animate-spin mx-auto size-8 mt-6 invisible data-[active=true]:visible" data-active={isValidating || isLoading} />
    </div>
  )
}
