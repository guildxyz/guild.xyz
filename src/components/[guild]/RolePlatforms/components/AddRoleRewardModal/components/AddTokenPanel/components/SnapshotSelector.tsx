import {
  Center,
  Flex,
  FormControl,
  FormLabel,
  Skeleton,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { AddRewardForm } from "components/[guild]/AddRewardButton/AddRewardButton"
import useGuild from "components/[guild]/hooks/useGuild"
import CreateSnapshotModal from "components/[guild]/leaderboard/Snapshots/CreateSnapshotModal"
import Button from "components/common/Button"
import ControlledSelect from "components/common/ControlledSelect"
import { useSnapshots } from "hooks/useSnapshot"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import Star from "static/icons/star.svg"
import { PlatformGuildData, PlatformType, SelectOption } from "types"
import ExistingPointsTypeSelect from "../../AddPointsPanel/components/ExistingPointsTypeSelect"

const SnapshotSelector = () => {
  const { onClose, onOpen, isOpen } = useDisclosure()

  const { guildPlatforms } = useGuild()
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const existingPointsRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  const [selectedPointId, setSelectedPointId] = useState(
    existingPointsRewards?.[0]?.id
  )

  const { setValue: setRootValue } = useFormContext<AddRewardForm>()
  const setRequirement = (req: any) => setRootValue("requirements", [req])

  const reqs = useWatch({ name: "requirements" })

  const { snapshots, isSnapshotsLoading } = useSnapshots(selectedPointId)

  const getPointPlatform = (guildPlatformId: number) => {
    return guildPlatforms.find((gp) => gp.id === guildPlatformId)
      ?.platformGuildData as PlatformGuildData["POINTS"]
  }

  const options: SelectOption<number>[] = !!snapshots
    ? snapshots.map((snapshot) => {
        return {
          label: `${snapshot.name} (${
            getPointPlatform(snapshot.guildPlatformId)?.name || "points"
          })`,
          value: snapshot.id,
          img: getPointPlatform(snapshot.guildPlatformId)?.imageUrl || (
            <Center boxSize={5}>
              <Star />
            </Center>
          ),
        }
      })
    : []

  return (
    <>
      <ExistingPointsTypeSelect
        existingPointsRewards={existingPointsRewards}
        selectedExistingId={selectedPointId}
      />

      {(!snapshots || isSnapshotsLoading) && <Skeleton height={"40px"} />}

      {snapshots?.length === 0 ? (
        <>
          <Button w="full" boxSizing="border" onClick={onOpen} mt={2}>
            Create snapshot
          </Button>

          <CreateSnapshotModal onClose={onClose} isOpen={isOpen} />
        </>
      ) : (
        <>
          <FormControl>
            <Flex justifyContent={"space-between"} w="full">
              <FormLabel>Select snapshot</FormLabel>
              <Button size="xs" variant="ghost" borderRadius={"lg"} onClick={onOpen}>
                <Text colorScheme={"gray"}>Create new</Text>
              </Button>
            </Flex>
            <ControlledSelect
              name={`snapshotId`}
              options={options}
              afterOnChange={() =>
                setRequirement({
                  type: "FREE",
                })
              }
            ></ControlledSelect>
            <CreateSnapshotModal onClose={onClose} isOpen={isOpen} />
          </FormControl>
        </>
      )}
    </>
  )
}

export default SnapshotSelector
