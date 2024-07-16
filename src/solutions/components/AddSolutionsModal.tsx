import { ModalOverlay, useDisclosure } from "@chakra-ui/react"
import SelectRolePanel from "components/[guild]/AddRewardButton/SelectRolePanel"
import { ADD_REWARD_FORM_DEFAULT_VALUES } from "components/[guild]/AddRewardButton/constants"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { AddRewardForm } from "components/[guild]/AddRewardButton/types"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import { ClientStateRequirementHandlerProvider } from "components/[guild]/RequirementHandlerContext"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { useMemo, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { modalSizeForPlatform } from "rewards"
import rewardsComponents from "rewards/components"
import { SolutionName, solutions } from "solutions"
import SolutionsPanel from "./SolutionsPanel"

const AddSolutionsModal = () => {
  const { selection, step, isOpen, setStep, onClose } = useAddRewardContext()
  const [solution, setSolution] = useState<SolutionName | null>()

  const methods = useForm<AddRewardForm>({
    defaultValues: ADD_REWARD_FORM_DEFAULT_VALUES,
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

  const SolutionPanel = useMemo(() => {
    if (solution) return solutions[solution]
    return null
  }, [solution])

  const RewardPanel = useMemo(() => {
    if (selection) {
      const { AddRewardPanel } = rewardsComponents[selection] ?? {}
      return AddRewardPanel
    }
    return null
  }, [selection])

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

      {step === "HOME" && <SolutionsPanel setSolution={setSolution} />}

      <FormProvider {...methods}>
        <ClientStateRequirementHandlerProvider methods={methods}>
          {isRewardSetupStep && !!RewardPanel && (
            <RewardPanel onAdd={handleAddReward} skipSettings />
          )}
          {step === "SELECT_ROLE" && <SelectRolePanel onSuccess={onClose} />}
        </ClientStateRequirementHandlerProvider>
      </FormProvider>

      {step === "SOLUTION_SETUP" && !!SolutionPanel && (
        <SolutionPanel
          onClose={(closeAll) => {
            if (closeAll) onClose()
            setStep("HOME")
          }}
        />
      )}

      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={handleDiscard}
      />
    </Modal>
  )
}

export default AddSolutionsModal
