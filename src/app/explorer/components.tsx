"use client"

import { useAtom, useAtomValue, useSetAtom } from "jotai"
// React and related
import {
  PropsWithChildren,
  Suspense,
  memo,
  useEffect,
  useRef,
  useState,
} from "react"

import Image from "next/image"
import Link from "next/link"
// Next.js
import { usePathname, useRouter, useSearchParams } from "next/navigation"

// SWR
import { SWRConfig, type SWRConfiguration } from "swr"
import useSWRInfinite from "swr/infinite"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useYourGuilds } from "@/hooks/useYourGuilds"
import useUser from "components/[guild]/hooks/useUser"
import useDebouncedState from "hooks/useDebouncedState"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
// Custom hooks
import useIsStuck from "hooks/useIsStuck"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import useScrollspy from "hooks/useScrollSpy"

import { GuildCardSkeleton, GuildCardWithLink } from "@/components/GuildCard"
import { Anchor } from "@/components/ui/Anchor"
// UI components
import { Button, buttonVariants } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"

// Icons
import {
  MagnifyingGlass,
  Plus,
  PushPin,
  Sparkle,
  Spinner,
} from "@phosphor-icons/react"

// Utilities and types
import { cn } from "@/lib/utils"
import { env } from "env"
import { GuildBase, SearchParams } from "types"
import { ActiveSection } from "./types"

// Atoms
import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { atom } from "jotai"

const isNavStuckAtom = atom(false)
const isSearchStuckAtom = atom(false)
const activeSectionAtom = atom(ActiveSection.YourGuilds)

enum Order {
  Featured = "FEATURED",
  Newest = "NEWEST",
}

const smoothScrollTo = (id: string) => {
  const target = document.getElementById(id)
  if (target) window.scrollTo({ behavior: "smooth", top: target.offsetTop })
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

const GuildCardMemo = memo(GuildCardWithLink)

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
        {renderedGuilds?.length
          ? renderedGuilds.map((data) => (
              <GuildCardMemo key={data.id} guildData={data} />
            ))
          : Array.from({ length: BATCH_SIZE }, (_, i) => (
              <GuildCardSkeleton key={i} />
            ))}
      </section>
      <Spinner
        className="invisible mx-auto size-8 animate-spin data-[active=true]:visible"
        data-active={isValidating || isLoading}
      />
    </>
  )
}

const useExploreGuilds = (searchParams?: SearchParams) => {
  const { isSuperAdmin } = useUser()
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()
  const fetcherWithSign = useFetcherWithSign()
  const options: SWRConfiguration = {
    dedupingInterval: 60_000,
  }

  // sending authed request for superAdmins, so they can see unverified & hideFromExplorer guilds too
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
            <Plus weight="bold" />
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
            <GuildCardWithLink guildData={guild} key={guild.id} />
          ))}
    </section>
  )
}

const Nav = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom)
  const isSearchStuck = useAtomValue(isSearchStuckAtom)
  const [activeSection, setActiveSection] = useAtom(activeSectionAtom)
  const spyActiveSection = useScrollspy(Object.values(ActiveSection), 100)
  useEffect(() => {
    if (!spyActiveSection) return
    setActiveSection(spyActiveSection as ActiveSection)
  }, [spyActiveSection, setActiveSection])

  return (
    <ToggleGroup
      type="single"
      className="gap-2"
      size={isSearchStuck ? "sm" : "lg"}
      variant={isNavStuck ? "secondary" : "mono"}
      onValueChange={(value) => value && setActiveSection(value as ActiveSection)}
      value={activeSection}
    >
      <ToggleGroupItem
        value={ActiveSection.YourGuilds}
        className={cn("rounded-xl transition-all", {
          "rounded-lg": isSearchStuck,
        })}
        onClick={() => smoothScrollTo(ActiveSection.YourGuilds)}
      >
        Your guilds
      </ToggleGroupItem>
      <ToggleGroupItem
        value={ActiveSection.ExploreGuilds}
        className={cn("rounded-xl transition-all", {
          "rounded-lg": isSearchStuck,
        })}
        onClick={() => smoothScrollTo(ActiveSection.ExploreGuilds)}
      >
        Explore guilds
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

const CreateGuildLink = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom)
  return (
    <Link
      href="/create-guild"
      aria-label="Create guild"
      prefetch={false}
      className={buttonVariants({
        variant: "ghost",
        size: "sm",
        className: [
          // Temporarily, until we don't migrate the scrollable Tabs component
          "min-h-11 w-11 gap-1.5 px-0 sm:min-h-0 sm:w-auto sm:px-3",
          {
            "text-white": !isNavStuck,
          },
        ],
      })}
    >
      <Plus />
      <span className="hidden sm:inline-block">Create guild</span>
    </Link>
  )
}

const StickyBar = () => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsNavStuck = useSetAtom(isNavStuckAtom)
  const isSearchStuck = useAtomValue(isSearchStuckAtom)
  const { ref: navToggleRef } = useIsStuck(setIsNavStuck)

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex h-16 w-full items-center transition-all",
        {
          "h-12": isSearchStuck,
        }
      )}
      ref={navToggleRef}
    >
      <div className="relative flex w-full items-center justify-between">
        <Nav />
        {isWeb3Connected && <CreateGuildLink />}
      </div>
    </div>
  )
}

const Explorer = ({ searchParams }: { searchParams: SearchParams }) => {
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

const ExplorerSWRProvider = ({
  children,
  value,
}: PropsWithChildren<{ value: SWRConfiguration }>) => (
  <SWRConfig value={value}>{children}</SWRConfig>
)

const HeaderBackground = () => {
  const isNavStuck = useAtomValue(isNavStuckAtom)
  const isSearchStuck = useAtomValue(isSearchStuckAtom)

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-10 h-0 bg-card shadow-md transition-all duration-200 dark:bg-background",
        {
          "h-16": isNavStuck,
          "h-[calc(theme(space.36)+theme(space.2))] bg-gradient-to-b from-card to-background sm:h-[calc(theme(space.28)-theme(space.2))] dark:from-background dark:to-card-secondary/50":
            isSearchStuck,
        }
      )}
    />
  )
}

export { Explorer, ExplorerSWRProvider, HeaderBackground }
