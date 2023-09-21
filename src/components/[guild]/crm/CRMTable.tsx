import {
  Checkbox,
  Flex,
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
import { Table as TableType, flexRender } from "@tanstack/react-table"
import Card from "components/common/Card"
import useScrollEffect from "hooks/useScrollEffect"
import { useEffect, useRef, useState } from "react"
import { PlatformAccountDetails } from "types"
import { TABS_HEIGHT_SM, TABS_SM_BUTTONS_STYLES } from "../Tabs/Tabs"
import MemberModal from "./MemberModal"

export type CrmRole = {
  roleId?: number
  requirementId?: number
  access?: boolean
  amount?: number
}

export type Member = {
  userId: number
  addresses: string[]
  platformUsers: PlatformAccountDetails[]
  joinedAt: string
  roles: {
    hidden?: CrmRole[]
    public: CrmRole[]
  }
}

type Props = {
  table: TableType<Member>
  data: Member[]
  error: Error | string
  isValidating: boolean
  setSize: any
}

const HEADER_HEIGHT = "61px"

const CRMTable = ({ table, data, error, isValidating, setSize }: Props) => {
  const cardBg = useColorModeValue("white", "var(--chakra-colors-gray-700)") // css variable form so it works in boxShadow literal for identityTags

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

  /** "100vw without scrollbar" solution, so the tables sides doesn't get cut off */
  useEffect(() => {
    const setVw = () => {
      const vw = document.documentElement.clientWidth / 100
      document.documentElement.style.setProperty("--vw", `${vw}px`)
    }
    setVw()
    window.addEventListener("resize", setVw)

    return () => {
      window.removeEventListener("resize", setVw)
    }
  }, [])

  const CHECKBOX_COLUMN_WIDTH = 45
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
        w={isStuck ? "100vw" : "calc(var(--vw, 1vw) * 100)"}
        flex="1 0 auto"
        h={`calc(100vh - ${TABS_HEIGHT_SM})`}
        overflowY={isStuck ? "auto" : "hidden"}
      >
        <Card overflow="visible" h="fit-content" mx="auto" mb="2">
          <Table
            borderColor="whiteAlpha.300"
            minWidth="calc(var(--chakra-sizes-container-lg) - calc(var(--chakra-space-10) * 2))"
            // needed so the Th elements can have boxShadow
            sx={{ borderCollapse: "separate", borderSpacing: 0 }}
          >
            <Thead>
              <Tr>
                {/* We don't support multiple header groups right now. Should rewrite it based on the example if we'll need it */}
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <CrmTh
                    key={header.id}
                    isStuck={isStuck}
                    bg={cardBg}
                    colSpan={header.colSpan}
                    {...(header.column.id === "identity" && {
                      left: "0",
                      zIndex: 2,
                    })}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </CrmTh>
                ))}
              </Tr>
            </Thead>
            <Tbody
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
              {error ? (
                <CrmInfoRow py="10">Couldn't fetch members</CrmInfoRow>
              ) : !data ? (
                [...Array(20)].map((_, i) => (
                  <CrmSkeletonRow key={i} columns={table.getAllLeafColumns()} />
                ))
              ) : table.getRowModel().rows.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <Tr key={row.id} role="group">
                      {row.getVisibleCells().map((cell) => (
                        <CrmInteractiveTd
                          key={cell.id}
                          transition="background .2s"
                          {...(cell.column.id === "identity" && {
                            position: "sticky",
                            left: "0",
                            width: "0px",
                            zIndex: 1,
                            className: "identityTd",
                            ...(isIdentityStuck && {
                              bg: cardBg,
                            }),
                          })}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </CrmInteractiveTd>
                      ))}
                      <MemberModal row={row} />
                    </Tr>
                  ))
                  .concat(
                    isValidating ? (
                      [...Array(20)].map((_, i) => (
                        <CrmSkeletonRow
                          key={i}
                          columns={table.getAllLeafColumns()}
                        />
                      ))
                    ) : (
                      <CrmInfoRow>
                        <Text
                          colorScheme="gray"
                          fontSize={"xs"}
                          fontWeight={"bold"}
                          textTransform={"uppercase"}
                        >
                          End of results
                        </Text>
                      </CrmInfoRow>
                    )
                  )
              ) : (
                <CrmInfoRow py="10">
                  No members satisfy the filters you've set
                </CrmInfoRow>
              )}
            </Tbody>
          </Table>
        </Card>
      </Flex>
    </Flex>
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

const CrmTh = ({ children, isStuck, ...rest }) => {
  const theadBoxShadow = useColorModeValue("md", "2xl")

  return (
    <Th
      position="sticky"
      top="0"
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
      boxShadow={isStuck && theadBoxShadow}
      transition="box-shadow .2s"
      borderTopWidth="1px"
      {...rest}
    >
      {children}
    </Th>
  )
}

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
      {...rest}
    >
      {children}
    </CrmTd>
  </Tr>
)

export default CRMTable
