import { ModalOverlay, useDisclosure } from "@chakra-ui/react"
import {
  AddRewardForm,
  defaultValues,
} from "components/[guild]/AddRewardButton/AddRewardButton"
import SelectRolePanel from "components/[guild]/AddRewardButton/SelectRolePanel"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import { ClientStateRequirementHandlerProvider } from "components/[guild]/RequirementHandlerContext"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { modalSizeForPlatform } from "rewards"
import SolutionsPanel from "./SolutionsPanel"

const AddSolutionsModal = () => {
  const { selection, step, isOpen, setStep, onClose } = useAddRewardContext()
  const [AddPanel, setAddPanel] = useState<JSX.Element>()

  const methods = useForm<AddRewardForm>({
    defaultValues,
  })

  const visibility = useWatch({ name: "visibility", control: methods.control })

  const handleAddReward = (createdRolePlatform: any) => {
    const { roleName = null, requirements = null, ...rest } = createdRolePlatform
    methods.setValue("rolePlatforms.0", {
      ...rest,
      visibility,
    })
    if (roleName) methods.setValue("roleName", roleName)
    if (Array.isArray(requirements) && requirements.length > 0) {
      methods.setValue("requirements", requirements)
    }
    setStep("SELECT_ROLE")
  }

  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const [isAddRewardPanelDirty, setIsAddRewardPanelDirty] =
    useAddRewardDiscardAlert()
  const isRewardSetupStep = selection && step === "REWARD_SETUP"

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={
        step === "SELECT_ROLE"
          ? "2xl"
          : step === "SOLUTION_SETUP"
          ? "xl"
          : isRewardSetupStep
          ? modalSizeForPlatform(selection)
          : "4xl"
      }
      scrollBehavior="inside"
      colorScheme="dark"
    >
      <ModalOverlay />

      {step === "HOME" && (
        <SolutionsPanel addReward={handleAddReward} setAddPanel={setAddPanel} />
      )}

      <FormProvider {...methods}>
        <ClientStateRequirementHandlerProvider methods={methods}>
          {isRewardSetupStep && !!AddPanel && AddPanel}
          {step === "SELECT_ROLE" && <SelectRolePanel onSuccess={onClose} />}
        </ClientStateRequirementHandlerProvider>
      </FormProvider>

      {step === "SOLUTION_SETUP" && !!AddPanel && AddPanel}

      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={handleDiscard}
      />
    </Modal>
  )
}

export default AddSolutionsModal
