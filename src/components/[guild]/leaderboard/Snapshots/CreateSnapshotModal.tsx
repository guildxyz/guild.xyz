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
import useShowErrorToast from "hooks/useShowErrorToast"
import { useCreateSnapshot } from "hooks/useSnapshot"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformType } from "types"
import SnapshotTable from "./SnapshotTable"

type Props = {
  onClose: () => void
  isOpen: boolean
  onSuccess: (snapshotId: number) => void
  defaultPointsId?: number
}

const CreateSnapshotModal = ({
  onClose,
  isOpen,
  onSuccess,
  defaultPointsId,
}: Props) => {
  const router = useRouter()
  const showErrorToast = useShowErrorToast()

  const [name, setName] = useState(
    new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  )

  const { guildPlatforms, id: guildId } = useGuild()

  const existingPointsRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  const methods = useForm<AddPointsFormType>({
    mode: "all",
  })

  const { setValue } = methods

  const selectedExistingId = useWatch({
    name: "data.guildPlatformId",
  })

  const {
    submitCreate,
    isLoading: isSubmitLoading,
    error: submitError,
  } = useCreateSnapshot(selectedExistingId)

  useEffect(() => {
    if (!submitError) return
    showErrorToast("Failed to create snapshot")
    console.error(submitError)
  }, [submitError])

  const onSubmit = async () => {
    const result = await submitCreate({ shouldStatusUpdate: false, name: name })
    if (result) {
      onSuccess(result?.id)
    }
  }

  const { data, mutate } = useSWRWithOptionalAuth(
    !!guildId && !!selectedExistingId
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
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
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

              <Button
                mt={8}
                w="full"
                colorScheme={"green"}
                onClick={onSubmit}
                isLoading={isSubmitLoading}
              >
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
