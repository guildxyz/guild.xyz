import {
  Box,
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
            <ModalHeader pb="4">Create snapshot</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Text colorScheme={"gray"} fontWeight={"medium"} mb="6">
                Capture a snapshot of the current leaderboard state to use for token
                rewards, or as a requirement for roles
              </Text>
              <Stack gap={4}>
                <ExistingPointsTypeSelect
                  existingPointsRewards={existingPointsRewards}
                  selectedExistingId={selectedExistingId}
                />
                <FormControl>
                  <FormLabel>Snapshot name</FormLabel>
                  <Input
                    defaultValue={new Date().toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  />
                </FormControl>
                <Box>
                  <Text fontWeight={"medium"} mb="2">
                    Preview
                  </Text>
                  <SnapshotTable
                    snapshotData={leaderboardToSnapshot}
                    chakraProps={{ mt: 0 }}
                  />
                </Box>
              </Stack>

              <Button mt={8} w="full" colorScheme={"green"}>
                Create
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </FormProvider>
    </>
  )
}

export default CreateSnapshotModal
