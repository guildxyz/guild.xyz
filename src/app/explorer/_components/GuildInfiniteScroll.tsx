"use client"

import { GuildCardSkeleton, GuildCardWithLink } from "@/components/GuildCard"
import { Spinner } from "@phosphor-icons/react"
import useUser from "components/[guild]/hooks/useUser"
import { env } from "env"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import { memo, useRef } from "react"
import { SWRConfiguration } from "swr"
import useSWRInfinite from "swr/infinite"
import { GuildBase, SearchParams } from "types"

const BATCH_SIZE = 24

const GuildCardMemo = memo(GuildCardWithLink)

const GuildCards = ({ guildData }: { guildData?: GuildBase[] }) => {
  if (guildData?.length) {
    return guildData.map((data) => <GuildCardMemo key={data.id} guildData={data} />)
  }
  return Array.from({ length: BATCH_SIZE }, (_, i) => <GuildCardSkeleton key={i} />)
}

const useExploreGuilds = (searchParams?: SearchParams) => {
  const { isSuperAdmin } = useUser()
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()
  const fetcherWithSign = useFetcherWithSign()
  const options: SWRConfiguration = {
    dedupingInterval: 60_000,
  }

  // sending authed request for superAdmins, so they can see unverified & hideFromExplorer guilds too
  // @ts-expect-error TODO: resolve this type error
  return useSWRInfinite<GuildBase[]>(
    (pageIndex, previousPageData) => {
      if (Array.isArray(previousPageData) && previousPageData.length !== BATCH_SIZE)
        return null
      const url = new URL("/v2/guilds", env.NEXT_PUBLIC_API)
      const params: Record<string, string> = {
        order: "FEATURED",
        ...searchParams,
        offset: (BATCH_SIZE * pageIndex).toString(),
        limit: BATCH_SIZE.toString(),
      }
      for (const entry of Object.entries(params)) {
        url.searchParams.set(...entry)
      }

      const urlString = url.pathname + url.search
      if (isSuperAdmin) return getKeyForSWRWithOptionalAuth(urlString)
      return urlString
    },
    isSuperAdmin ? fetcherWithSign : options,
    isSuperAdmin ? options : null
  )
}

export const GuildInfiniteScroll = ({
  searchParams,
}: { searchParams: SearchParams }) => {
  const search = searchParams.search
  const ref = useRef<HTMLElement>(null)
  const {
    data: filteredGuilds,
    setSize,
    isValidating,
    isLoading,
  } = useExploreGuilds(searchParams)
  const renderedGuilds = filteredGuilds?.flat()

  useScrollBatchedRendering({
    batchSize: 1,
    scrollTarget: ref,
    disableRendering: isValidating,
    setElementCount: setSize,
    offsetPixel: 420,
  })

  if (!renderedGuilds?.length && !isLoading) {
    if (!isValidating && !search?.length) {
      return (
        <div>Can't fetch guilds from the backend right now. Check back later!</div>
      )
    } else {
      return <div>{`No results for ${search}`}</div>
    }
  }

  return (
    <>
      <section
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        ref={ref}
      >
        <GuildCards guildData={renderedGuilds} />
      </section>
      <Spinner
        className="invisible mx-auto size-8 animate-spin data-[active=true]:visible"
        data-active={isValidating || isLoading}
      />
    </>
  )
}
