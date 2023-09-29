import {
  Center,
  Checkbox,
  Flex,
  Progress,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Table as TableType, flexRender } from "@tanstack/react-table"
import Card from "components/common/Card"
import useScrollEffect from "hooks/useScrollEffect"
import { useRef, useState } from "react"
import { SWRInfiniteResponse } from "swr/infinite"
import { TABS_HEIGHT_SM, TABS_SM_BUTTONS_STYLES } from "../Tabs/Tabs"
import MemberModal from "./MemberModal"
import { Member } from "./useMembers"

type Props = {
  table: TableType<Member>
  hasReachedTheEnd: boolean
  data: Member[]
} & Omit<SWRInfiniteResponse<Member[]>, "data">

const HEADER_HEIGHT = "61px"
const CHECKBOX_COLUMN_WIDTH = 45

const CRMTable = ({
  table,
  data,
  error,
  isValidating,
  isLoading,
  setSize,
  hasReachedTheEnd,
}: Props) => {
  const cardBg = useColorModeValue("white", "var(--chakra-colors-gray-700)") // css variable form so it works in boxShadow literal for identityTags
  const theadBoxShadow = useColorModeValue("md", "2xl")

  /**
   * Observing if we've scrolled to the bottom of the page. The table has to be the
   * last element anyway so we can't scroll past it, and it works more reliable than
   * useIsStucked
   */
  const [isStuck, setIsStuck] = useState(false)
  useScrollEffect(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
      setIsStuck(true)
    } else setIsStuck(false)
  }, [])

  const scrollContainerRef = useRef(null)
  const [isIdentityStuck, setIsIdentityStuck] = useState(false)
  useScrollEffect(
    () => {
      const { scrollLeft, scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current

      if (scrollLeft > CHECKBOX_COLUMN_WIDTH) setIsIdentityStuck(true)
      else setIsIdentityStuck(false)

      if (scrollTop + clientHeight >= scrollHeight - 300 && !isValidating) {
        setSize((prevSize) => prevSize + 1)
      }
    },
    [scrollContainerRef.current, isValidating],
    null,
    scrollContainerRef.current
  )

  return (
    <Flex justifyContent={"center"} position="relative" zIndex="banner">
      <style>
        {/* not using overflow-y: hidden just hiding the scrollbar, so it's possible
        to scroll back at the top and get out of the stucked state */}
        {isStuck &&
          `body::-webkit-scrollbar {display: none !important; scrollbar-width: none; -webkit-appearance: none;}
           #tabs::before {height: calc(${TABS_HEIGHT_SM} + ${HEADER_HEIGHT}); background-color: ${cardBg}}
           ${TABS_SM_BUTTONS_STYLES}`}
        {/* the table is elevated to be above the headers shadow, and the popovers need to be elevated above that */}
        {`body {overflow-x: hidden !important}
          .chakra-popover__popper { z-index: var(--chakra-zIndices-banner) !important };`}
      </style>
      <Flex
        ref={scrollContainerRef}
        w="100vw"
        flex="1 0 auto"
        h={`calc(100vh - ${TABS_HEIGHT_SM})`}
        overflowY={isStuck ? "auto" : "hidden"}
      >
        <Card overflow="visible" h="fit-content" mx="auto" mb="2">
          <Table
            borderColor="whiteAlpha.300"
            minWidth={{
              base: "container.sm",
              sm: "700px",
              md: "880px",
              lg: "calc(var(--chakra-sizes-container-lg) - calc(var(--chakra-space-10) * 2))",
            }}
            // needed so the Th elements can have border
            sx={{ borderCollapse: "separate", borderSpacing: 0 }}
          >
            <Thead
              position="sticky"
              top="0"
              zIndex="2"
              boxShadow={isStuck && theadBoxShadow}
              transition="box-shadow .2s"
            >
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
            <Tbody
              /**
               * Will change: these styles are needed here so the css only hover
               * based expand animation works, will rework to be manually switchable
               * with state management
               */
              sx={{
                ".identityTag": {
                  boxShadow: `0 0 0 1px ${cardBg}`,
                },
                ":has(.identityTd:hover)": !isIdentityStuck && {
                  ".identityTag": {
                    marginLeft: "0",
                  },
                },
              }}
            >
              {!data && isLoading ? (
                [...Array(20)].map((_, i) => (
                  <CrmSkeletonRow
                    key={`loading_skeleton_${i}`}
                    columns={table.getAllLeafColumns()}
                  />
                ))
              ) : data ? (
                table.getRowModel().rows.length ? (
                  table
                    .getRowModel()
                    .rows.map((row) => (
                      <MemberRow
                        key={row.id}
                        {...{ row, isIdentityStuck, cardBg }}
                      />
                    ))
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
                        [...Array(20)].map((_, i) => (
                          <CrmSkeletonRow
                            key={`validating_skeleton_${i}`}
                            columns={table.getAllLeafColumns()}
                          />
                        ))
                      )
                    )
                ) : (
                  <CrmInfoRow py="10">
                    No members satisfy the filters you've set
                  </CrmInfoRow>
                )
              ) : (
                <CrmInfoRow py="10">
                  {error?.message || "Couldn't fetch members"}
                </CrmInfoRow>
              )}
            </Tbody>
          </Table>
        </Card>
      </Flex>
    </Flex>
  )
}

const MemberRow = ({ row, isIdentityStuck, cardBg }) => {
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
            zIndex: 1,
            className: "identityTd",
            ...(isIdentityStuck && {
              maxWidth: "150px",
              bg: cardBg,
            }),
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

export default CRMTable
