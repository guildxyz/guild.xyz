import {
  Box,
  BoxProps,
  CloseButton,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react"
import { useVirtualizer } from "@tanstack/react-virtual"
import CopyableAddress from "components/common/CopyableAddress"
import useDebouncedState from "hooks/useDebouncedState"
import { MagnifyingGlass } from "phosphor-react"
import { useMemo, useRef, useState } from "react"

type Props = {
  snapshotData: {
    rank: number
    points: number
    address: string
  }[]
  chakraProps?: BoxProps
}

/**
 * For some strange reason, the virtualized part cannot be placed directly as a child
 * in the Modal because of some issue with how Chakra's Portal behaves. It should be
 * wrapped in a component like this, only then will the parentRef correctly load.
 * https://github.com/chakra-ui/chakra-ui/issues/5257
 */

const SnapshotTable = ({ snapshotData, chakraProps }: Props) => {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedState(search)

  const borderColor = useColorModeValue("gray.200", "gray.600")
  const borderRightColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200")
  const bgColor = useColorModeValue("gray.200", "gray.700")

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
    <Stack gap={2}>
      <InputGroup>
        <InputLeftElement>
          <Icon boxSize={4} as={MagnifyingGlass} />
        </InputLeftElement>
        <Input
          placeholder={"Search addresses"}
          noOfLines={1}
          color="var(--chakra-colors-chakra-body-text)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <InputRightElement>
            <CloseButton size="sm" rounded="full" onClick={() => setSearch("")} />
          </InputRightElement>
        )}
      </InputGroup>
      <Box
        ref={parentRef}
        position={"relative"}
        minH={"80px"}
        height={"fit-content"}
        maxH={"400px"}
        overflowY={"auto"}
        border={"1px"}
        borderColor={borderColor}
        rounded={"md"}
        mt={4}
        {...chakraProps}
      >
        <Box height={`${rowVirtualizer.getTotalSize()}px`}>
          <Table
            size={"sm"}
            variant="simple"
            style={{ borderCollapse: "separate", borderSpacing: "0" }}
          >
            <Thead
              height={10}
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <Tr>
                <Th
                  borderRightColor={borderRightColor}
                  background={bgColor}
                  zIndex={2}
                >
                  #
                </Th>
                <Th
                  borderRightColor={borderRightColor}
                  background={bgColor}
                  zIndex={2}
                >
                  Address
                </Th>
                <Th
                  borderRightColor={borderRightColor}
                  background={bgColor}
                  zIndex={2}
                >
                  Points
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = searchResults[virtualRow.index]
                return (
                  <Tr
                    key={row.rank}
                    height={`${virtualRow.size}px`}
                    style={{
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`,
                    }}
                  >
                    <Td>{row.rank}</Td>
                    <Td>
                      <CopyableAddress
                        address={row.address}
                        decimals={5}
                        fontSize="sm"
                      />
                    </Td>
                    <Td>{row.points}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Stack>
  )
}

export default SnapshotTable
