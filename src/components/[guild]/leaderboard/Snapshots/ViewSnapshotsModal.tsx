import {
  Box,
  Center,
  CloseButton,
  HStack,
  Icon,
  IconButton,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react"
import { useAccessedGuildPoints } from "components/[guild]/AccessHub/hooks/useAccessedGuildPoints"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import useDebouncedState from "hooks/useDebouncedState"
import { useRouter } from "next/router"
import { ArrowLeft, MagnifyingGlass } from "phosphor-react"
import { useEffect, useState } from "react"
import Star from "static/icons/star.svg"
import SnapshotCard from "./SnapshotCard"

type Props = {
  onClose: () => void
  isOpen: boolean
}

const ViewSnapshotsModal = ({ onClose, isOpen }: Props) => {
  const { colorMode } = useColorMode()

  const [selectedSnapshot, setSelectedSnapshot] = useState(null)

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedState(search)

  const [searchResults, setSearchResults] = useState(selectedSnapshot?.data)

  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResults(selectedSnapshot?.data)
      return
    }
    setSearchResults(
      selectedSnapshot?.data?.filter((row) =>
        row.address.includes(debouncedSearch.trim().toLowerCase())
      )
    )
  }, [selectedSnapshot, debouncedSearch])
  const { urlName } = useGuild()
  const router = useRouter()

  const pointsRewards = useAccessedGuildPoints("ALL")
  if (pointsRewards.length < 2) return null

  const pointsRewardsData = pointsRewards.map((gp) => ({
    id: gp.id.toString(),
    name: gp.platformGuildData.name || "points",
    image: gp.platformGuildData.imageUrl ? (
      <Img src={gp.platformGuildData.imageUrl} boxSize={5} borderRadius={"full"} />
    ) : (
      <Center boxSize={5}>
        <Star />
      </Center>
    ),
  }))

  const currentPoints = pointsRewardsData.find(
    (points) => points.id === router.query.pointsId
  )

  const snapshots = [
    {
      id: 1,
      name: "Uniswap Community Boost",
      date: "2022.05.06. 6:00 PM",
      data: [
        {
          rank: 3,
          address: "0xaef0c7d50e8d7bd4f2d9dd57c5ee31fffb76c1f2",
          points: 3475,
        },
        {
          rank: 1,
          address: "0x6d8ae1f5c6e5a23d70f1318c44d5a59e2f4286c4",
          points: 8734,
        },
        {
          rank: 2,
          address: "0xf23ee5d5b1e2c3aefb24b5b6bd9e2ba3a2f6b5b3",
          points: 4623,
        },
        {
          rank: 4,
          address: "0xd2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1",
          points: 1348,
        },
      ],
    },
    {
      id: 2,
      name: "Chainlink Oracle Airdrop",
      date: "2022.05.05. 6:00 PM",
      data: [
        {
          rank: 3,
          address: "0xaef0c7d50e8d7bd4f2d9dd57c5ee31fffb76c1f2",
          points: 3475,
        },
        {
          rank: 1,
          address: "0x6d8ae1f5c6e5a23d70f1318c44d5a59e2f4286c4",
          points: 8734,
        },
        {
          rank: 2,
          address: "0xf23ee5d5b1e2c3aefb24b5b6bd9e2ba3a2f6b5b3",
          points: 4623,
        },
        {
          rank: 4,
          address: "0xd2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1",
          points: 1348,
        },
      ],
    },
  ]

  const handleClose = () => {
    setSelectedSnapshot(null)
    onClose()
  }

  return (
    <>
      <Modal size="lg" isOpen={isOpen} onClose={handleClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          {!selectedSnapshot ? (
            <>
              <ModalHeader>Leaderboard snapshots</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <Stack>
                  {snapshots.map((snapshot) => (
                    <SnapshotCard
                      key={snapshot.id}
                      name={snapshot.name}
                      date={snapshot.date}
                      image={currentPoints.image}
                      onClick={() => setSelectedSnapshot(snapshot)}
                    />
                  ))}
                </Stack>
              </ModalBody>
            </>
          ) : (
            <>
              <ModalHeader>
                <HStack>
                  <IconButton
                    rounded="full"
                    aria-label="Back"
                    size="sm"
                    mb="-3px"
                    icon={<ArrowLeft size={20} />}
                    variant="ghost"
                    onClick={() => setSelectedSnapshot(null)}
                  />
                  <Text>{selectedSnapshot.name}</Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <HStack justifyContent={"space-between"}>
                  <Text color={"GrayText"}>Point type</Text>
                  <HStack>
                    {currentPoints.image}
                    <Text>{currentPoints.name}</Text>
                  </HStack>
                </HStack>
                <HStack justifyContent={"space-between"}>
                  <Text color={"GrayText"}>Created at</Text>
                  <Text>{selectedSnapshot.date}</Text>
                </HStack>

                <Box
                  maxH={64}
                  overflowY={"scroll"}
                  border={"1px"}
                  borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
                  rounded={"md"}
                  mt={4}
                >
                  <Table
                    size={"sm"}
                    variant="simple"
                    style={{ borderCollapse: "separate", borderSpacing: "0" }}
                  >
                    <Thead height={10}>
                      <Tr>
                        <Th
                          position={"sticky"}
                          top={0}
                          borderRightColor={
                            colorMode === "dark"
                              ? "whiteAlpha.200"
                              : "blackAlpha.200"
                          }
                          background={colorMode === "dark" ? "gray.700" : "gray.200"}
                          zIndex={2}
                        >
                          #
                        </Th>
                        <Th
                          position={"sticky"}
                          top={0}
                          borderRightColor={
                            colorMode === "dark"
                              ? "whiteAlpha.200"
                              : "blackAlpha.200"
                          }
                          background={colorMode === "dark" ? "gray.700" : "gray.200"}
                          zIndex={2}
                        >
                          <InputGroup>
                            <InputLeftElement h="8" w="auto">
                              <Icon boxSize={3.5} as={MagnifyingGlass} />
                            </InputLeftElement>
                            <Input
                              placeholder={"Search addresses"}
                              noOfLines={1}
                              fontSize={"small"}
                              variant={"unstyled"}
                              h="8"
                              pl="6"
                              pr="6"
                              color="var(--chakra-colors-chakra-body-text)"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />

                            <InputRightElement h="8" w="auto">
                              <CloseButton size="sm" rounded="full" />
                            </InputRightElement>
                          </InputGroup>
                        </Th>
                        <Th
                          textTransform={"capitalize"}
                          letterSpacing={"normal"}
                          position={"sticky"}
                          top={0}
                          background={colorMode === "dark" ? "gray.700" : "gray.200"}
                          zIndex={2}
                        >
                          Points
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {searchResults
                        ?.sort((a, b) => a.rank - b.rank)
                        .map((row) => (
                          <Tr key={row.rank}>
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
                        ))}
                    </Tbody>
                  </Table>
                </Box>

                <Stack mt={4}>
                  <Button>Download</Button>
                  <Button variant="outline">Delete</Button>
                </Stack>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ViewSnapshotsModal
