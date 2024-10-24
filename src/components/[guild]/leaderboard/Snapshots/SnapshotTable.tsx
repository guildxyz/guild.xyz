import { CopyableAddress } from "@/components/CopyableAddress"
import { IconButton } from "@/components/ui/IconButton"
import { Input } from "@/components/ui/Input"
import { MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr"
import { useVirtualizer } from "@tanstack/react-virtual"
import { HTMLAttributes, useMemo, useRef, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

interface Props extends HTMLAttributes<HTMLDivElement> {
  snapshotData: {
    rank: number
    points: number
    address: string
  }[]
}

/**
 * For some strange reason, the virtualized part cannot be placed directly as a child
 * in the Modal because of some issue with how Chakra's Portal behaves. It should be
 * wrapped in a component like this, only then will the parentRef correctly load.
 * https://github.com/chakra-ui/chakra-ui/issues/5257
 */

const SnapshotTable = ({ snapshotData, ...props }: Props) => {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounceValue(search, 500)

  const searchResults = useMemo(() => {
    if (!debouncedSearch) return snapshotData
    return snapshotData
      .filter((row) => row.address?.includes(debouncedSearch.trim().toLowerCase()))
      .sort((a, b) => a.rank - b.rank)
  }, [snapshotData, debouncedSearch])

  const parentRef = useRef(null)

  const rowVirtualizer = useVirtualizer({
    count: searchResults.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 100,
  })

  return (
    <div className="grid gap-2">
      <div className="relative">
        <Input
          className="px-8"
          placeholder="Search addresses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MagnifyingGlass
          weight="bold"
          className="absolute top-3 left-3 size-4 text-muted-foreground"
        />
        {!!search && (
          <IconButton
            aria-label="Clear search input"
            icon={<X weight="bold" />}
            size="xs"
            variant="ghost"
            className="absolute top-2 right-2 rounded-full"
            onClick={() => setSearch("")}
          />
        )}
      </div>

      <div
        ref={parentRef}
        className="custom-scrollbar relative mt-4 h-fit max-h-96 min-h-20 overflow-y-auto rounded-md border border-border"
        {...props}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-[1] h-10 border-border border-b bg-card shadow-sm">
              <tr className="text-left text-muted-foreground text-xs uppercase">
                <th className="z-[2] border-border border-r border-b px-4">#</th>
                <th className="z-[2] border-border border-r border-b px-4">
                  Address
                </th>
                <th className="z-[2] border-border border-b px-4">Points</th>
              </tr>
            </thead>

            <tbody>
              {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = searchResults[virtualRow.index]
                return (
                  <tr
                    key={row.rank}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`,
                    }}
                  >
                    <td className="border-border border-r border-b px-4">
                      {row.rank}
                    </td>
                    <td className="border-border border-r border-b px-4">
                      <CopyableAddress
                        address={row.address}
                        decimals={5}
                        className="text-sm"
                      />
                    </td>
                    <td className="border-border border-r border-b px-4">
                      {row.points}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SnapshotTable
