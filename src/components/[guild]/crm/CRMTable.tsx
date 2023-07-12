import {
  Checkbox,
  Flex,
  HStack,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Card from "components/common/Card"
import useScrollEffect from "hooks/useScrollEffect"
import { useMemo, useState } from "react"
import { PlatformAccountDetails, Visibility } from "types"
import useGuild from "../hooks/useGuild"
import FilterByRoles, { roleFilter, roleSort } from "./FilterByRoles"
import Identities from "./Identities"
import IdentitiesSearch from "./IdentitiesSearch"
import OrderByColumn from "./OrderByColumn"
import RoleTags from "./RoleTags"
import useMembers from "./useMembers"

export type Member = {
  userId: number
  addresses: string[]
  platformUsers: PlatformAccountDetails[]
  joinedAt: string
  publicRoleIds: number[]
  hiddenRoleIds: number[]
}

const columnHelper = createColumnHelper<Member>()

const CRMTable = () => {
  const { data } = useMembers()
  const { roles } = useGuild()

  const hasHiddenRoles = roles.some((role) => role.visibility === Visibility.HIDDEN)

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            {...{
              isChecked: table.getIsAllRowsSelected(),
              isIndeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
            colorScheme="primary"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              isChecked: row.getIsSelected(),
              isDisabled: !row.getCanSelect(),
              isIndeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
            colorScheme="primary"
            mt="2px"
          />
        ),
      },
      columnHelper.accessor((row) => row, {
        id: "identity",
        cell: (info) => <Identities member={info.getValue()} />,
        header: () => <IdentitiesSearch />,
      }),
      {
        id: "roles",
        header: ({ column }) => (
          <HStack w="full" justifyContent={"space-between"}>
            <Text>{`Roles ${hasHiddenRoles ? "(hidden, public)" : ""}`}</Text>
            <HStack spacing="0">
              <FilterByRoles column={column} />
              <OrderByColumn
                label="Number of roles"
                column={column
                  .getLeafColumns()
                  .find(({ id }) => id === "publicRoleIds")}
              />
            </HStack>
          </HStack>
        ),
        columns: hasHiddenRoles
          ? [
              columnHelper.accessor("hiddenRoleIds", {
                filterFn: roleFilter,
                cell: (info) => <RoleTags roleIds={info.getValue()} />,
              }),
              columnHelper.accessor("publicRoleIds", {
                filterFn: roleFilter,
                sortingFn: roleSort,
                cell: (info) => <RoleTags roleIds={info.getValue()} />,
              }),
            ]
          : [
              columnHelper.accessor("publicRoleIds", {
                filterFn: roleFilter,
                sortingFn: roleSort,
                cell: (info) => <RoleTags roleIds={info.getValue()} />,
              }),
            ],
      },
      columnHelper.accessor("joinedAt", {
        header: ({ column }) => (
          <HStack w="full" justifyContent={"space-between"}>
            <Text>Joined at</Text>
            <OrderByColumn label="Join date" column={column} />
          </HStack>
        ),
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
    ],
    [hasHiddenRoles]
  )

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  })

  const cardBg = useColorModeValue("white", "gray.700")
  const theadBoxShadow = useColorModeValue("md", "2xl")

  const [isStuck, setIsStuck] = useState(false)
  useScrollEffect(() => {
    /**
     * Observing if we've scrolled to the bottom of the page. The table has to be the
     * last element anyway so we can't scroll past it, and it works more reliable
     * than useIsStucked
     */
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setIsStuck(true)
    } else setIsStuck(false)
  }, [])

  return (
    <Flex justifyContent={"center"} position="relative" zIndex="banner">
      <style>
        {/* not using overflow-y: hidden just hiding the scrollbar, so it's possible
        to scroll back at the top and get out of the stucked state */}
        {isStuck &&
          `body::-webkit-scrollbar {display: none !important; scrollbar-width: none; -webkit-appearance: none;}`}
        {/* the table is elevated to be above the headers shadow, and the popovers need to be elevated above that */}
        {`body {overflow-x: hidden !important}
          .chakra-popover__popper { z-index: var(--chakra-zIndices-banner) !important };`}
      </style>
      <Flex
        w="100vw"
        flex="1 0 auto"
        // 100vh - Tabs height (button height + padding)
        h="calc(100vh - calc(var(--chakra-space-11) + (2 * var(--chakra-space-2-5))))"
        overflowY={isStuck ? "auto" : "hidden"}
      >
        <Card overflow="visible" h="fit-content" mx="auto" mb="2">
          <Table
            borderColor="whiteAlpha.300"
            minWidth="calc(var(--chakra-sizes-container-lg) - calc(var(--chakra-space-10) * 2))"
            // needed so the Th elements can have boxShadow
            sx={{ borderCollapse: "separate", borderSpacing: 0 }}
          >
            <Thead
            // _before={{
            //   content: `""`,
            //   position: "fixed",
            //   top: "calc(var(--chakra-space-11) + (2 * var(--chakra-space-2-5)))",
            //   left: 0,
            //   right: 0,
            //   width: "full",
            //   // button height + padding
            //   height: "61px",
            //   bgColor: "white",
            //   boxShadow: "md",
            //   transition: "opacity 0.2s ease, visibility 0.1s ease",
            //   visibility: isStuck ? "visible" : "hidden",
            //   opacity: isStuck ? 1 : 0,
            //   borderTopWidth: "1px",
            //   borderTopStyle: "solid",
            // }}
            >
              <Tr>
                {/* We don't support multiple header groups right now. Should rewrite it based on the example if we'll need it */}
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <Th
                    key={header.id}
                    position="sticky"
                    top="0"
                    bg={cardBg}
                    overflow="hidden"
                    p="3.5"
                    sx={
                      !isStuck && {
                        "&:first-of-type": {
                          borderTopLeftRadius: "xl",
                        },
                        "&:last-of-type": {
                          borderTopRightRadius: "xl",
                          borderRightWidth: 0,
                        },
                      }
                    }
                    zIndex="1"
                    colSpan={header.colSpan}
                    boxShadow={isStuck && theadBoxShadow}
                    transition="box-shadow .2s"
                    borderTopWidth="1px"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {data ? (
                table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <Td key={cell.id} fontSize={"sm"} px="3.5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      ))}
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td
                      px="3.5"
                      py="6"
                      textAlign={"center"}
                      colSpan={"100%" as any}
                      borderBottomRadius={"2xl"}
                    >
                      No members satisfy the filters you've set
                    </Td>
                  </Tr>
                )
              ) : (
                [...Array(20)].map((i) => (
                  <Tr key={i}>
                    <Td fontSize={"sm"} px="3.5" w="12">
                      <Checkbox mt="2px" />
                    </Td>
                    {table
                      .getAllLeafColumns()
                      .slice(1)
                      .map((column) => (
                        <Td key={column.id} fontSize={"sm"} px="3.5">
                          <Skeleton w="20" h="5" />
                        </Td>
                      ))}
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Card>
      </Flex>
    </Flex>
  )
}

export default CRMTable
