import {
  Center,
  HStack,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { useAccessedGuildPoints } from "components/[guild]/AccessHub/hooks/useAccessedGuildPoints"
import { useEffect, useState } from "react"
import Star from "static/icons/star.svg"
import SnapshotTable from "./SnapshotTable"

type Props = {
  onClose: () => void
  isOpen: boolean
  snapshotRequirement: any
}

type SnapshotData = {
  rank: number
  address: `0x${string}`
  points: number
}

const SnapshotModal = ({ onClose, isOpen, snapshotRequirement }: Props) => {
  const [snapshotData, setSnapshotData] = useState<SnapshotData[]>([])

  useEffect(() => {
    const formatted = snapshotRequirement.data.snapshot
      .sort((a, b) => b.value - a.value)
      .map((row, idx) => ({
        rank: idx + 1,
        address: row.key as `0x${string}`,
        points: row.value,
      }))
    setSnapshotData(formatted)
  }, [snapshotRequirement])

  const pointsRewards = useAccessedGuildPoints("ALL")
  const pointsReward = pointsRewards.find(
    (gp) => gp.id === snapshotRequirement.data.guildPlatformId
  )

  const pointData = pointsReward
    ? {
        id: pointsReward.id.toString(),
        name: pointsReward.platformGuildData.name || "points",
        image: pointsReward.platformGuildData.imageUrl ? (
          <Img
            src={pointsReward.platformGuildData.imageUrl}
            boxSize={5}
            borderRadius={"full"}
          />
        ) : (
          <Center boxSize={5}>
            <Star />
          </Center>
        ),
      }
    : null

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <Modal size="lg" isOpen={isOpen} onClose={handleClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text>{snapshotRequirement.name || "View snapshot"}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <HStack justifyContent={"space-between"}>
              <Text color={"GrayText"}>Snapshot type</Text>

              <Text>{pointData ? "Point based" : "Custom upload"}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              {pointData && (
                <>
                  <Text color={"GrayText"}>Point type</Text>
                  <HStack>
                    {pointData.image}
                    <Text>{pointData.name}</Text>
                  </HStack>
                </>
              )}
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text color={"GrayText"}>Created at</Text>
              <Text>{new Date(snapshotRequirement.createdAt).toLocaleString()}</Text>
            </HStack>

            <SnapshotTable snapshotData={snapshotData} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SnapshotModal
