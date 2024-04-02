import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import { AddPointsFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/AddPointsPanel"
import ExistingPointsTypeSelect from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/ExistingPointsTypeSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformType } from "types"
import SnapshotTable from "./SnapshotTable"

type Props = {
  onClose: () => void
  isOpen: boolean
}

const CreateSnapshotModal = ({ onClose, isOpen }: Props) => {
  const router = useRouter()

  const { guildPlatforms, id: guildId } = useGuild()

  const existingPointsRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  const methods = useForm<AddPointsFormType>({
    mode: "all",
  })

  const { control, setValue } = methods

  const selectedExistingId = useWatch({
    control,
    name: "data.guildPlatformId",
  })

  const { data, error, mutate } = useSWRWithOptionalAuth(
    guildId
      ? `/v2/guilds/${guildId}/points/${selectedExistingId}/leaderboard`
      : null,
    { revalidateOnMount: true },
    false,
    false
  )

  useEffect(() => {
    const currentPointsId =
      router?.query?.pointsId && Number(router?.query?.pointsId)
    setValue(
      "data.guildPlatformId",
      currentPointsId ?? existingPointsRewards?.[0]?.id
    )
    mutate()
  }, [existingPointsRewards?.[0]?.id, router?.query?.pointsId])

  const leaderboardToSnapshot = useMemo(() => {
    if (!data?.leaderboard) return []
    const snapshot = data?.leaderboard

    return snapshot.map((val, idx) => {
      return { rank: idx + 1, address: val.address, points: val.totalPoints }
    })
  }, [data])

  return (
    <>
      <FormProvider {...methods}>
        <Modal size="lg" isOpen={isOpen} onClose={onClose} colorScheme="dark">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text>Create snapshot</Text>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Stack justifyContent={"space-between"} gap={4} mb={5}>
                <Text color={"GrayText"} fontWeight={"medium"}>
                  Capture a snapshot of the current leaderboard state to use for
                  token rewards or as a requirement for different roles
                </Text>
                <ExistingPointsTypeSelect
                  existingPointsRewards={existingPointsRewards}
                  selectedExistingId={selectedExistingId}
                />
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input />
                </FormControl>
              </Stack>

              <Stack gap={3}>
                <Text fontWeight={"medium"}>Preview</Text>
                <SnapshotTable
                  snapshotData={leaderboardToSnapshot}
                  chakraProps={{ mt: 0 }}
                />
              </Stack>

              <Stack mt={4}>
                <Button colorScheme={"primary"}>Create</Button>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </FormProvider>
    </>
  )
}

export default CreateSnapshotModal
