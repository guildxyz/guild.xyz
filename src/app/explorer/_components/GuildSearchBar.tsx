"use client"
import { MagnifyingGlass, PushPin, Sparkle } from "@phosphor-icons/react"
import { ActiveSection } from "app/explorer/types"
import useDebouncedState from "hooks/useDebouncedState"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "../../../v2/components/ui/Input"
import { ToggleGroup, ToggleGroupItem } from "../../../v2/components/ui/ToggleGroup"
import { smoothScrollTo } from "./StickyBar"

enum Order {
  Featured = "FEATURED",
  Newest = "NEWEST",
}

export const GuildSearchBar = () => {
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
