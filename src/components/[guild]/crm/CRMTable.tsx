import {
  Checkbox,
  HStack,
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
import { PlatformAccountDetails } from "types"
import FilterByRoles, { roleFilter } from "./FilterByRoles"
import Identities from "./Identities"
import IdentitiesSearch from "./IdentitiesSearch"
import OrderByColumn from "./OrderByColumn"
import RoleTags from "./RoleTags"
import useMembers from "./useMembers"

export type Member = {
  id: number
  addresses: string[]
  platformUsers: PlatformAccountDetails[]
  joinedAt: string
  roleIds: number[]
}

const columnHelper = createColumnHelper<Member>()

const columns = [
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
  columnHelper.accessor("roleIds", {
    header: ({ column }) => (
      <HStack w="full" justifyContent={"space-between"}>
        <Text>Roles</Text>
        <HStack spacing="0">
          <FilterByRoles column={column} />
          <OrderByColumn label="Number of roles" column={column} />
        </HStack>
      </HStack>
    ),
    filterFn: roleFilter,
    cell: (info) => <RoleTags roleIds={info.getValue()} />,
  }),
  columnHelper.accessor("joinedAt", {
    header: ({ column }) => (
      <HStack w="full" justifyContent={"space-between"}>
        <Text>Joined at</Text>
        <OrderByColumn label="Join date" column={column} />
      </HStack>
    ),
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
]

const CRMTable = () => {
  const { data } = useMembers()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  })

  const cardBg = useColorModeValue("white", "gray.700")

  if (!data) return null

  return (
    <Card overflow="visible">
      <Table borderColor="whiteAlpha.300">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  position="sticky"
                  top="16"
                  bg={cardBg}
                  overflow="hidden"
                  px="3.5"
                  sx={{
                    "&:first-of-type": {
                      borderTopLeftRadius: "xl",
                    },
                    "&:last-of-type": {
                      borderTopRightRadius: "xl",
                      borderRightWidth: 0,
                    },
                  }}
                  zIndex="1"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id} fontSize={"sm"} px="3.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  )
}

export default CRMTable
