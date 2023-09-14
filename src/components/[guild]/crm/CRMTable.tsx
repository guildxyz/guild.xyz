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
import useMembers from "./useMembers"

export type Member = {
  userId: number
  addresses: string[]
  platformUsers: PlatformAccountDetails[]
  joinedAt: string
  roleIds: {
    hidden?: number[]
    public: number[]
  }
}

type Props = {
  table: TableType<Member>
}

const HEADER_HEIGHT = "61px"

const CRMTable = ({ table }: Props) => {
  const { isLoading, error } = useMembers()

  const cardBg = useColorModeValue("white", "var(--chakra-colors-gray-700)") // css variable form so it works in boxShadow literal for identityTags
  const tdBg = useColorModeValue(`gray.50`, "#3A3A40") // dark color is from blackAlpha.200, but without opacity so it can overlay when sticky
  const tdHoverBg = useColorModeValue(`blackAlpha.50`, "whiteAlpha.50")
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
      if (scrollContainerRef.current.scrollLeft > CHECKBOX_COLUMN_WIDTH)
        setIsIdentityStuck(true)
      else setIsIdentityStuck(false)
    },
    [scrollContainerRef.current],
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
        // 100vh - Tabs height (button height + padding)
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
                    {...(header.column.id === "identity" && {
                      left: "0",
                      zIndex: 2,
                    })}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                [...Array(20)].map((i) => (
                  <Tr key={i}>
                    <Td fontSize={"sm"} px="3.5" w="12" bg={tdBg}>
                      <Checkbox mt="2px" />
                    </Td>
                    {table
                      .getAllLeafColumns()
                      .slice(1)
                      .map((column) => (
                        <Td key={column.id} fontSize={"sm"} px="3.5" bg={tdBg}>
                          <Skeleton w="20" h="5" />
                        </Td>
                      ))}
                  </Tr>
                ))
              ) : error ? (
                <Tr>
                  <Td
                    px="3.5"
                    py="10"
                    textAlign={"center"}
                    colSpan={"100%" as any}
                    borderBottomRadius={"2xl"}
                    bg={tdBg}
                  >
                    Couldn't fetch members
                  </Td>
                </Tr>
              ) : table.getRowModel().rows.length ? (
                table
                  .getRowModel()
                  .rows.slice(0, 20)
                  .map((row) => (
                    <Tr key={row.id} role="group">
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          position={"relative"}
                          key={cell.id}
                          fontSize={"sm"}
                          px="3.5"
                          onClick={
                            cell.column.id !== "select"
                              ? row.getToggleExpandedHandler()
                              : undefined
                          }
                          cursor="pointer"
                          bg={tdBg}
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
                          transition="background .2s"
                          {...(cell.column.id === "identity" && {
                            position: "sticky",
                            left: "0",
                            width: "0px",
                            zIndex: 1,
                            ...(isIdentityStuck && {
                              bg: cardBg,
                              sx: {
                                ".identityTag": {
                                  boxShadow: `0 0 0 1px ${cardBg}`,
                                },
                                ".identityTag:not(:first-of-type)": {
                                  marginLeft: "var(--stacked-margin-left)",
                                },
                              },
                            }),
                          })}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      ))}
                      <MemberModal row={row} />
                    </Tr>
                  ))
                  .concat(
                    <Tr>
                      <Td
                        px="3.5"
                        textAlign={"center"}
                        colSpan={"100%" as any}
                        borderBottomRadius={"2xl"}
                        bg={tdBg}
                      >
                        <Text
                          colorScheme="gray"
                          fontSize={"xs"}
                          fontWeight={"bold"}
                          textTransform={"uppercase"}
                        >
                          End of results
                        </Text>
                      </Td>
                    </Tr>
                  )
              ) : (
                <Tr>
                  <Td
                    px="3.5"
                    py="10"
                    textAlign={"center"}
                    colSpan={"100%" as any}
                    borderBottomRadius={"2xl"}
                    bg={tdBg}
                  >
                    No members satisfy the filters you've set
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Card>
      </Flex>
    </Flex>
  )
}

export default CRMTable
