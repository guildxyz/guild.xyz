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
import { useRouter } from "next/router"
import { ArrowLeft } from "phosphor-react"
import { useState } from "react"
import Star from "static/icons/star.svg"
import SnapshotCard from "./SnapshotCard"

type Props = {
  onClose: () => void
  isOpen: boolean
}

const ViewSnapshotsModal = ({ onClose, isOpen }: Props) => {
  const { colorMode } = useColorMode()

  const [selectedSnapshot, setSelectedSnapshot] = useState(null)

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
      data: [],
    },
    {
      id: 2,
      name: "Chainlink Oracle Airdrop",
      date: "2022.05.05. 6:00 PM",
      data: [],
    },
  ]

  const handleClose = () => {
    setSelectedSnapshot(null)
    onClose()
  }

  return (
    <>
      <Modal size="lg" isOpen={isOpen} onClose={handleClose}>
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

              <ModalBody></ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ViewSnapshotsModal
