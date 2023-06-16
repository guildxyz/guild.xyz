import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Card from "components/common/Card"
import { PlatformAccountDetails } from "types"
import Identities from "./Identities"
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
  columnHelper.accessor((row) => row, {
    id: "identity",
    cell: (info) => <Identities member={info.getValue()} />,
    header: () => <span>Identity</span>,
  }),
  columnHelper.accessor("roleIds", {
    header: () => "Roles",
    cell: (info) => <RoleTags roleIds={info.getValue()} />,
  }),
  columnHelper.accessor("joinedAt", {
    header: () => "Joined at",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
]

const CRMTable = () => {
  const { data } = useMembers()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!data) return null

  return (
    <Card>
      <TableContainer>
        <Table borderColor="whiteAlpha.300">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
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
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default CRMTable
