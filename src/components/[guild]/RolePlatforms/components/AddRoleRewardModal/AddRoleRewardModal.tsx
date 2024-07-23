import { ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import useGuild from "components/[guild]/hooks/useGuild"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { useState } from "react"
import { useWatch } from "react-hook-form"
import { AddRewardPanelProps, modalSizeForPlatform } from "rewards"
import rewardComponents from "rewards/components"
import { RoleFormType } from "types"
import EditRolePlatformModal from "../EditRolePlatformModal"
import SelectRewardPanel from "./SelectRewardPanel"
import SelectExistingPlatform from "./components/SelectExistingPlatform"

type Props = {
  onAdd: AddRewardPanelProps["onAdd"]
}

const AddRoleRewardModal = ({ onAdd }: Props) => {
  const { guildPlatforms } = useGuild()
  const { selection, step, isOpen, onClose } = useAddRewardContext()

  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const { AddRewardPanel } = rewardComponents[selection] ?? {}

  const roleVisibility = useWatch<RoleFormType, "visibility">({ name: "visibility" })
  const [isAddRewardPanelDirty, setIsAddRewardPanelDirty] =
    useAddRewardDiscardAlert()
  const isRewardSetupStep = selection && step !== "HOME" && step !== "SELECT_ROLE"

  const [selectedExistingRolePlatform, setSelectedExistingRolePlatform] =
    useState<Parameters<AddRewardPanelProps["onAdd"]>[0]>()

  const handleAddReward = (data: Parameters<AddRewardPanelProps["onAdd"]>[0]) => {
    const rolePlatformWithVisibility = { ...data, visibility: roleVisibility }

    const existingGuildPlatform = guildPlatforms?.find(
      (gp) =>
        gp.platformId === data.guildPlatform?.platformId &&
        gp.platformGuildId === data.guildPlatform?.platformGuildId
    )

    /**
     * We display all Discord servers (even the ones which are already used in the current Guild as a reward)
     * in `DiscordGuildSetup`, but in case the user picks a server which is already added to the guild,
     * we only need to send its `guildPlatformId` to our API, and not the actual `guildPlatform` object,
     * so we add that ID here.
     *
     * We don't delete the `guildPlatform` object, because we use stuff like server name from it later
     * in the code, just adding `guildPlatformId`, so our API won't try to create a new reward entity.
     *
     * Maybe we should think about a refactor here later.
     */
    if (existingGuildPlatform) {
      rolePlatformWithVisibility.guildPlatformId = existingGuildPlatform.id
      setSelectedExistingRolePlatform(rolePlatformWithVisibility)
      onEditRolePlatformModalOpen()
    } else {
      onAdd(rolePlatformWithVisibility)
    }

    onClose()
  }

  const handleClose = () => {
    if (isAddRewardPanelDirty) {
      onDiscardAlertOpen()
    } else {
      onClose()
    }
  }

  const handleDiscard = () => {
    onClose()
    onDiscardAlertClose()
    setIsAddRewardPanelDirty(false)
  }

  const {
    isOpen: isEditRolePlatformModalOpen,
    onOpen: onEditRolePlatformModalOpen,
    onClose: onEditRolePlatformModalClose,
  } = useDisclosure()

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={
          step === "SELECT_ROLE"
            ? "2xl"
            : isRewardSetupStep
              ? modalSizeForPlatform(selection)
              : "4xl"
        }
        scrollBehavior="inside"
        colorScheme="dark"
      >
        <ModalOverlay />

        {step === "HOME" && (
          <SelectRewardPanel>
            <SelectExistingPlatform onClose={onClose} onSelect={onAdd} />
            <Text fontWeight="bold" mb="3">
              Add new reward
            </Text>
          </SelectRewardPanel>
        )}

        {isRewardSetupStep && (
          <AddRewardPanel onAdd={handleAddReward} skipSettings />
        )}

        <DiscardAlert
          isOpen={isDiscardAlertOpen}
          onClose={onDiscardAlertClose}
          onDiscard={handleDiscard}
        />
      </Modal>

      {selectedExistingRolePlatform && (
        <EditRolePlatformModal
          rolePlatform={selectedExistingRolePlatform}
          isOpen={isEditRolePlatformModalOpen}
          onSubmit={(data) => {
            onAdd({ ...selectedExistingRolePlatform, ...data })
            onEditRolePlatformModalClose()
          }}
          onClose={onEditRolePlatformModalClose}
        />
      )}
    </>
  )
}

export default AddRoleRewardModal
