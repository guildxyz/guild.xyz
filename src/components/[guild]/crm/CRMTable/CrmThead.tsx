import { Progress, Th, Thead, Tr } from "@chakra-ui/react"
import { Table, flexRender } from "@tanstack/react-table"
import { useCardBg } from "components/common/Card"
import { Member } from "../useMembers"

type Props = {
  table: Table<Member>
  isLoading: boolean
}

const CrmThead = ({ table, isLoading }: Props) => {
  const cardBg = useCardBg()

  return (
    <Thead position="sticky" top="0" zIndex="2" transition="box-shadow .2s">
      <Tr>
        {/* We don't support multiple header groups right now. Should rewrite it based on the example if we'll need it */}
        {table.getHeaderGroups()[0].headers.map((header) => (
          <Th
            key={header.id}
            p="3.5"
            borderTopWidth="1px"
            bg={cardBg}
            colSpan={header.colSpan}
            width={header.column.getSize()}
            sx={{
              "&:first-of-type": {
                borderTopLeftRadius: "xl",
              },
              "&:last-of-type": {
                borderTopRightRadius: "xl",
                borderRightWidth: 0,
              },
            }}
            {...(header.column.id === "identity" && {
              position: "sticky",
              left: "0",
              zIndex: 2,
            })}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </Th>
        ))}
      </Tr>
      {isLoading && (
        <Progress
          pos="absolute"
          bg="transparent"
          left="0"
          right="0"
          bottom="0"
          zIndex="2"
          size="xs"
          isIndeterminate
        />
      )}
    </Thead>
  )
}

export default CrmThead
