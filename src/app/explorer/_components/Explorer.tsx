"use client"

import { GuildCardSkeleton, GuildCardWithLink } from "@/components/GuildCard"
import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Anchor } from "@/components/ui/Anchor"
import { Button, buttonVariants } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { useYourGuilds } from "@/hooks/useYourGuilds"
import {
  MagnifyingGlass,
  Plus,
  PushPin,
  SignIn,
  Sparkle,
  Spinner,
} from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import { env } from "env"
import useDebouncedState from "hooks/useDebouncedState"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import useIsStuck from "hooks/useIsStuck"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import { useSetAtom } from "jotai"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, memo, useRef } from "react"
import { useEffect, useState } from "react"
import { type SWRConfiguration } from "swr"
import useSWRInfinite from "swr/infinite"
import { GuildBase, SearchParams } from "types"
import { smoothScrollTo } from "utils/smoothScrollTo"
import { isSearchStuckAtom } from "../atoms"
import { ActiveSection } from "../types"
import { StickyBar } from "./StickyBar"

export const Explorer = ({ searchParams }: { searchParams: SearchParams }) => {
  const setIsSearchStuck = useSetAtom(isSearchStuckAtom)
  const { ref: searchRef } = useIsStuck(setIsSearchStuck)

  return (
    <>
      <StickyBar />
      <YourGuilds />

      <section id={ActiveSection.ExploreGuilds} className="flex flex-col gap-5">
        <h2 className="font-bold text-lg tracking-tight">Explore verified guilds</h2>

        <div className="sticky top-12 z-10" ref={searchRef}>
          <Suspense>
            <GuildSearchBar />
          </Suspense>
        </div>

        <GuildInfiniteScroll searchParams={searchParams} />
      </section>
    </>
  )
}

const GuildCardWithLinkMemo = memo(GuildCardWithLink)

const YourGuilds = () => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const { data, isLoading } = useYourGuilds()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  if (!isLoading && !data?.length)
    return (
      <Card className="mt-2 mb-8 flex flex-col items-stretch justify-between gap-8 p-6 font-semibold sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          {isWeb3Connected ? (
            <span>
              You're not a member of any guilds yet. Explore and join some below, or
              create your own!
            </span>
          ) : (
            <>
              <Image
                src="/landing/robot.svg"
                width={32}
                height={32}
                alt="Guild Robot icon"
                className="size-8 min-w-8"
              />
              <span>Sign in to view your guilds / create new ones</span>
            </>
          )}
        </div>

        {isWeb3Connected ? (
          <Anchor
            href="/create-guild"
            className={buttonVariants({ className: "hover:no-underline" })}
          >
            <Plus weight="bold" />
            <span>Create guild</span>
          </Anchor>
        ) : (
          <Button
            onClick={() => setIsWalletSelectorModalOpen(true)}
            colorScheme="primary"
          >
            <SignIn weight="bold" />
            <span>Sign in</span>
          </Button>
        )}
      </Card>
    )

  return (
    <section className="mt-1 mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading || !data
        ? Array.from({ length: 6 }, (_, i) => <GuildCardSkeleton key={i} />)
        : data.map((guild) => (
            <GuildCardWithLinkMemo guildData={guild} key={guild.id} />
          ))}
    </section>
  )
}

enum Order {
  Featured = "FEATURED",
  Newest = "NEWEST",
}

const GuildSearchBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [order, setOrder] = useState<Order>(
    (searchParams?.get("order")?.toString() as Order) || Order.Featured
  )
  const [search, setSearch] = useState(searchParams?.get("search")?.toString() || "")
  const debouncedSearch = useDebouncedState(search, 200)

  useEffect(() => {
    const newSearchParams = new URLSearchParams(
      Object.entries({ order, search: debouncedSearch }).filter(
        ([_, value]) => value
      )
    )

    router.push(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    })
  }, [search, debouncedSearch, order])

  return (
    <div className="relative flex flex-col gap-3 sm:flex-row sm:gap-0">
      <Input
        className="relative h-12 grow rounded-xl border border-border-muted pr-6 pl-10 text-md sm:rounded-r-none"
        placeholder="Search verified guilds"
        onChange={({ currentTarget }) => setSearch(currentTarget.value)}
        value={search}
      />
      <div className="absolute left-4 flex h-12 items-center justify-center">
        <MagnifyingGlass className="text-muted-foreground" />
      </div>
      <ToggleGroup
        type="single"
        className="self-start sm:h-12 sm:rounded-r-xl sm:border sm:border-border-muted sm:border-l-0 sm:bg-card sm:px-4"
        size="sm"
        variant="secondary"
        onValueChange={(value) => value && setOrder(value as Order)}
        value={order}
      >
        <ToggleGroupItem
          value={Order.Featured}
          className="space-x-2"
          onClick={() => smoothScrollTo(ActiveSection.ExploreGuilds)}
        >
          <PushPin weight="bold" />
          <span>featured</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value={Order.Newest}
          className="space-x-2"
          onClick={() => smoothScrollTo(ActiveSection.ExploreGuilds)}
        >
          <Sparkle weight="bold" />
          <span>newest</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

const BATCH_SIZE = 24
const GuildCards = ({ guildData }: { guildData?: GuildBase[] }) => {
  if (guildData?.length) {
    return guildData.map((data) => (
      <GuildCardWithLinkMemo key={data.id} guildData={data} />
    ))
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

const GuildInfiniteScroll = ({ searchParams }: { searchParams: SearchParams }) => {
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
        weight="bold"
        className="invisible mx-auto size-8 animate-spin data-[active=true]:visible"
        data-active={isValidating || isLoading}
      />
    </>
  )
}
