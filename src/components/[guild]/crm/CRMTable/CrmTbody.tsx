import {
  Center,
  Checkbox,
  HStack,
  Skeleton,
  Spinner,
  Tbody,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Table, flexRender } from "@tanstack/react-table"
import MemberModal from "../MemberModal"
import { Member } from "../useMembers"

type Props = {
  table: Table<Member>
  data: Member[]
  error: any
  isLoading: boolean
  hasReachedTheEnd: boolean
}

const CrmTbody = ({ table, data, error, isLoading, hasReachedTheEnd }: Props) => {
  const rows = table.getRowModel().rows

  return (
    <Tbody>
      {!data && isLoading ? (
        [...Array(20)].map((_, i) => (
          <CrmSkeletonRow
            key={`loading_skeleton_${i}`}
            columns={table.getAllLeafColumns()}
          />
        ))
      ) : data ? (
        rows.length ? (
          rows
            .map((row) => <MemberRow key={row.id} row={row} />)
            .concat(
              hasReachedTheEnd ? (
                <CrmInfoRow key="end_of_results">
                  <Text
                    colorScheme="gray"
                    fontSize={"xs"}
                    fontWeight={"bold"}
                    textTransform={"uppercase"}
                  >
                    End of results
                  </Text>
                </CrmInfoRow>
              ) : (
                <CrmInfoRow key="loading">
                  <HStack>
                    <Spinner size="sm" />
                    <Text>Loading more members</Text>
                  </HStack>
                </CrmInfoRow>
              )
            )
        ) : (
          <CrmInfoRow py="10">No members satisfy the filters you've set</CrmInfoRow>
        )
      ) : (
        <CrmInfoRow py="10">{error?.message || "Couldn't fetch members"}</CrmInfoRow>
      )}
    </Tbody>
  )
}

const MemberRow = ({ row }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Tr role="group">
      {row.getVisibleCells().map((cell) => (
        <CrmInteractiveTd
          key={cell.id}
          onClick={cell.column.id !== "select" ? onOpen : undefined}
          transition="background .2s"
          {...(cell.column.id === "identity" && {
            position: "sticky",
            left: "0",
            width: "0px",
            maxWidth: "350px",
            transition: "max-width .2s",
            zIndex: 1,
            className: "identityTd",
          })}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </CrmInteractiveTd>
      ))}
      <MemberModal {...{ row, isOpen, onClose }} />
    </Tr>
  )
}

const CrmSkeletonRow = ({ columns }) => (
  <Tr>
    <CrmTd w="12">
      <Checkbox mt="2px" />
    </CrmTd>
    {columns.slice(1).map((column) => (
      <CrmTd
        key={column.id}
        {...(column.id === "identity" && {
          position: "sticky",
          left: "0",
          zIndex: 1,
        })}
      >
        <Skeleton w="70%" h="5" />
      </CrmTd>
    ))}
  </Tr>
)

const CrmTd = ({ children, ...rest }) => {
  const tdBg = useColorModeValue(`gray.50`, "#3A3A40") // dark color is from blackAlpha.200, but without opacity so it can overlay when sticky

  return (
    <Td position={"relative"} fontSize={"sm"} px="3.5" bg={tdBg} {...rest}>
      {children}
    </Td>
  )
}

const CrmInteractiveTd = ({ children, ...rest }) => {
  const tdHoverBg = useColorModeValue(`blackAlpha.50`, "whiteAlpha.50")

  return (
    <CrmTd
      cursor="pointer"
      _before={{
        content: `""`,
        position: "absolute",
        inset: 0,
        bg: tdHoverBg,
        opacity: 0,
        transition: "opacity 0.1s",
        pointerEvents: "none",
      }}
      _groupHover={{ _before: { opacity: 1 } }}
      {...rest}
    >
      {children}
    </CrmTd>
  )
}

const CrmInfoRow = ({ children, ...rest }) => (
  <Tr>
    <CrmTd
      textAlign={"center"}
      colSpan={"100%" as any}
      borderBottomRadius={"2xl"}
      fontSize="md"
      px="0"
      {...rest}
    >
      {/* so it stays visible in the center when the table is bigger than the viewport too  */}
      <Center pos="sticky" left="0" px="3.5" maxW="100vw">
        {children}
      </Center>
    </CrmTd>
  </Tr>
)

export default CrmTbody
