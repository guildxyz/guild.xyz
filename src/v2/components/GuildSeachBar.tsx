"use client"

import { MagnifyingGlass, PushPin, Sparkle } from "@phosphor-icons/react"
import { Input } from "./ui/Input"
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup"
import { PrimitiveAtom, useSetAtom } from "jotai"
import React, { useEffect, useState } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { ActiveSection } from "app/explorer/types"
import useDebouncedState from "hooks/useDebouncedState"

enum Order {
  Featured = "FEATURED",
  Newest = "NEWEST",
}

export const GuildSearchBar = ({
  queryAtom,
}: {
  queryAtom: PrimitiveAtom<string>
}) => {
  const setGuildQuery = useSetAtom(queryAtom)
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const [order, setOrder] = useState<Order>(
    (searchParams?.get("order") as Order) || Order.Featured
  )
  const [search, setSearch] = useState(searchParams?.get("search") || "")
  const debouncedSearch = useDebouncedState(search, 90)

  useEffect(() => {
    if (pathName === null) return
    const newSearchParams = new URLSearchParams(
      Object.entries({ order, search: debouncedSearch }).filter(
        ([_, value]) => value
      )
    )
    history.replaceState(
      null,
      "",
      `${pathName}${window.location.hash}?${newSearchParams.toString()}`
    )
    setGuildQuery(newSearchParams.toString())
  }, [debouncedSearch, order, setGuildQuery, pathName])

  return (
    <div className="relative flex flex-col gap-3 py-4 sm:flex-row sm:gap-0">
      <Input
        className="text-md relative h-12 grow rounded-xl border pl-10 pr-6 sm:rounded-r-none"
        placeholder="Search verified guilds"
        onChange={({ currentTarget }) => setSearch(currentTarget.value)}
        value={search}
      />
      <div className="absolute left-4 flex h-12 items-center justify-center">
        <MagnifyingGlass className="text-muted-foreground" />
      </div>
      <ToggleGroup
        type="single"
        className="self-start sm:h-12 sm:rounded-r-lg sm:border sm:border-l-0 sm:bg-card sm:px-4"
        size="sm"
        variant="outline"
        onValueChange={(value) => value && setOrder(value as Order)}
        value={order}
      >
        <ToggleGroupItem value={Order.Featured} className="space-x-2" asChild>
          <a href={`#${ActiveSection.ExploreGuilds}`}>
            <PushPin />
            <span>featured</span>
          </a>
        </ToggleGroupItem>
        <ToggleGroupItem value={Order.Newest} className="space-x-2" asChild>
          <a href={`#${ActiveSection.ExploreGuilds}`}>
            <Sparkle />
            <span>newest</span>
          </a>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
