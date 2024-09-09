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
import ExistingPointsTypeSelect from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/ExistingPointsTypeSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import useCreateSnapshot from "hooks/useCreateSnapshot"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { FormProvider, useController, useForm } from "react-hook-form"
import { PlatformType } from "types"
import SnapshotTable from "./SnapshotTable"

type Props = {
  onClose: () => void
  isOpen: boolean
  onSuccess: (snapshotId: number) => void
}

const generateSnapshotName = (pointsName?: string) => {
  const dateString = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })

  return `${!!pointsName ? pointsName + " snapshot " : "Points snapshot"} ${dateString}`
}

const CreateSnapshotModal = ({ onClose, isOpen, onSuccess }: Props) => {
  const router = useRouter()
  const showErrorToast = useShowErrorToast()

  const { guildPlatforms, id: guildId } = useGuild()

  const existingPointsRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  const methods = useForm()

  const { control, setValue } = methods

  const { field: selectedExistingId } = useController({
    control,
    name: "data.guildPlatformId",
    defaultValue: router?.query?.pointsId
      ? Number(router?.query?.pointsId)
      : existingPointsRewards?.[0]?.id,
  })

  const selectedPointName =
    existingPointsRewards?.find((gp) => gp.id === selectedExistingId.value)
      ?.platformGuildData?.name || ""

  const {
    field: { value: name, onChange: onNameChange },
    fieldState: { isDirty: isNameDirty },
  } = useController({
    control,
    name: "name",
    defaultValue: generateSnapshotName(selectedPointName),
  })

  const { onSubmit: onCreateSnasphotSubmit, isLoading: isSubmitLoading } =
    useCreateSnapshot({
      guildPlatformId: Number(selectedExistingId.value),
      onSuccess: (res) => onSuccess(res),
      onError: (err) => {
        console.error(err)
        showErrorToast("Failed to create snapshot")
      },
    })

  const { data } = useSWRWithOptionalAuth(
    !!guildId && !!selectedExistingId.value
      ? `/v2/guilds/${guildId}/points/${selectedExistingId.value}/leaderboard`
      : null,
    { revalidateOnMount: true },
    false,
    false
  )

  const handleOnClose = () => {
    if (isSubmitLoading) {
      showErrorToast("You can't close the modal until the transaction finishes")
      return
    }
    onClose()
  }

  const leaderboardToSnapshot = useMemo(() => {
    if (!data?.leaderboard) return []
    const snapshot = data?.leaderboard

    return snapshot.map((val, idx) => ({
      rank: idx + 1,
      address: val.address,
      points: val.totalPoints,
    }))
  }, [data?.leaderboard])

  useEffect(() => {
    if (isNameDirty) return
    setValue("name", generateSnapshotName(selectedPointName))
  }, [setValue, selectedPointName, isNameDirty])

  return (
    <FormProvider {...methods}>
      <Modal size="lg" isOpen={isOpen} onClose={handleOnClose} colorScheme="dark">
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
                selectedExistingId={selectedExistingId.value}
              />
              <FormControl>
                <FormLabel>Snapshot name</FormLabel>
                <Input value={name} onChange={onNameChange} />
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
              onClick={() =>
                onCreateSnasphotSubmit({ shouldStatusUpdate: false, name: name })
              }
              isLoading={isSubmitLoading}
            >
              Create
            </Button>
            {isSubmitLoading && (
              <Text mt={1} color={"GrayText"} fontSize={"sm"}>
                Creating a snapshot of the leaderboard may take several minutes,
                depending on its size.
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </FormProvider>
  )
}

export default CreateSnapshotModal
