import { Table } from "@tanstack/react-table"
import Button from "components/common/Button"
import { Export } from "phosphor-react"
import { useIsTabsStuck } from "../Tabs/Tabs"
import { Member } from "./CRMTable"

type Props = {
  table: Table<Member>
}

const ExportMembers = ({ table }: Props) => {
  const { isStuck } = useIsTabsStuck()

  const value = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.addresses[0])

  const csvContent = encodeURI("data:text/csv;charset=utf-8," + value)

  const isDisabled = !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())

  return (
    <Button
      flexShrink={0}
      as="a"
      download="members"
      href={!isDisabled && csvContent}
      leftIcon={<Export />}
      variant="ghost"
      colorScheme={isStuck ? "gray" : "whiteAlpha"}
      isDisabled={isDisabled}
      size="sm"
    >
      Export selected
    </Button>
  )
}

export default ExportMembers
