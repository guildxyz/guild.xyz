import { GuildBase } from "types"
import { GuildCard, GuildCardSkeleton } from "./GuildCard"
import { atom } from "jotai"
import useSWRInfinite from "swr/infinite"
import { env } from "env"

export const guildQueryAtom = atom('')
const BATCH_SIZE = 24

const GuildCards = ({ guildData }: { guildData?: GuildBase[] }) => {
  if (guildData?.length) {
    return guildData.map((data) => <GuildCard key={data.name} guildData={data} />)
  }
  return Array.from({ length: BATCH_SIZE }, (_, i) => <GuildCardSkeleton key={i} />)
}

const getKey = (pageIndex: number) => {
  const request = new URL('/v2/guilds', env.NEXT_PUBLIC_API)
  request.searchParams.set('offset', (pageIndex * BATCH_SIZE).toString())
  request.searchParams.set('limit', BATCH_SIZE.toString())
  return request.href;
}

const fetcher = async (url: string) => (await fetch(url)).json()

export const GuildInfiniteScroll = () => {
  const { data: guildData, size, setSize, isLoading } = useSWRInfinite<GuildBase>(getKey, fetcher, { parallel: true })

  return <section className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <GuildCards guildData={guildData?.flat()} />
  </section>
}

