import {
  Center,
  HStack,
  IconButton,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { useAccessedGuildPoints } from "components/[guild]/AccessHub/hooks/useAccessedGuildPoints"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import useDebouncedState from "hooks/useDebouncedState"
import { useRouter } from "next/router"
import { ArrowLeft } from "phosphor-react"
import { useEffect, useState } from "react"
import Star from "static/icons/star.svg"
import SnapshotCard from "./SnapshotCard"
import SnapshotTable from "./SnapshotTable"

type Props = {
  onClose: () => void
  onCreate: () => void
  isOpen: boolean
}

export const MOCK_SNAPSHOT_DATA = [
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
]

export const MOCK_SNAPSHOTS = [
  {
    id: 1,
    pointsId: 29598,
    name: "Uniswap Community Boost",
    date: "2022.05.06. 6:00 PM",
    data: MOCK_SNAPSHOT_DATA,
  },
  {
    id: 2,
    pointsId: 29598,
    name: "Chainlink Oracle Airdrop",
    date: "2022.05.05. 6:00 PM",
    data: MOCK_SNAPSHOT_DATA,
  },
]

const ViewSnapshotsModal = ({ onClose, isOpen, onCreate }: Props) => {
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
                  {MOCK_SNAPSHOTS.map((snapshot) => (
                    <SnapshotCard
                      key={snapshot.id}
                      name={snapshot.name}
                      date={snapshot.date}
                      image={currentPoints.image}
                      onClick={() => setSelectedSnapshot(snapshot)}
                    />
                  ))}
                </Stack>

                <Stack mt={4}>
                  <Button colorScheme={"primary"} onClick={onCreate}>
                    Create new
                  </Button>
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

                <SnapshotTable snapshotData={selectedSnapshot?.data} />

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
