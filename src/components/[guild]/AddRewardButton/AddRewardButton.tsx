import { ModalOverlay, useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import useShowErrorToast from "hooks/useShowErrorToast"
import { atom, useAtomValue } from "jotai"
import { Plus } from "phosphor-react"
import rewards, { modalSizeForPlatform } from "platforms/rewards"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { Requirement, RoleFormType, Visibility } from "types"
import { AddRewardProvider, useAddRewardContext } from "../AddRewardContext"
import SelectRewardPanel from "../RolePlatforms/components/AddRoleRewardModal/SelectRewardPanel"
import { useIsTabsStuck } from "../Tabs"
import { useThemeContext } from "../ThemeContext"
import SelectRolePanel from "./SelectRolePanel"
import { useAddRewardDiscardAlert } from "./hooks/useAddRewardDiscardAlert"

export type AddRewardForm = {
  // TODO: we could simplify the form - we don't need a rolePlatforms array here, we only need one rolePlatform
  rolePlatforms: RoleFormType["rolePlatforms"][number][]
  requirements?: Requirement[]
  roleIds?: number[]
  visibility: Visibility
}

export const defaultValues: AddRewardForm = {
  rolePlatforms: [],
  requirements: [],
  roleIds: [],
  visibility: Visibility.PUBLIC,
}

export const canCloseAddRewardModalAtom = atom(true)

const AddRewardButton = (): JSX.Element => {
  const [isAddRewardPanelDirty, setIsAddRewardPanelDirty] =
    useAddRewardDiscardAlert()
  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const canClose = useAtomValue(canCloseAddRewardModalAtom)

  const {
    selection,
    step,
    setStep,
    isOpen,
    onOpen,
    onClose: onAddRewardModalClose,
  } = useAddRewardContext()

  const methods = useForm<AddRewardForm>({
    defaultValues,
  })

  const visibility = useWatch({ name: "visibility", control: methods.control })

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  const { AddRewardPanel } = rewards[selection] ?? {}
  const showErrorToast = useShowErrorToast()

  const isRewardSetupStep = selection && step !== "HOME" && step !== "SELECT_ROLE"

  const handleClose = () => {
    if (!canClose) {
      showErrorToast("You can't close the modal until the transaction finishes")
      return
    }
    if (isAddRewardPanelDirty) onDiscardAlertOpen()
    else {
      methods.reset(defaultValues)
      onAddRewardModalClose()
    }
  }

  return (
    <>
      <Button
        data-test="add-reward-button"
        leftIcon={<Plus />}
        onClick={onOpen}
        variant="ghost"
        size="sm"
        {...(!isStuck && {
          color: textColor,
          colorScheme: buttonColorScheme,
        })}
      >
        Add reward
      </Button>

      <FormProvider {...methods}>
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

          {step === "HOME" && <SelectRewardPanel />}

          {isRewardSetupStep && (
            <AddRewardPanel
              onAdd={(createdRolePlatform) => {
                methods.setValue("rolePlatforms.0", {
                  ...createdRolePlatform,
                  visibility,
                })
                if (createdRolePlatform?.requirements?.length > 0) {
                  methods.setValue("requirements", createdRolePlatform.requirements)
                }
                setStep("SELECT_ROLE")
              }}
              skipSettings
            />
          )}

          {step === "SELECT_ROLE" && <SelectRolePanel />}
        </Modal>
      </FormProvider>
      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={() => {
          onAddRewardModalClose()
          onDiscardAlertClose()
          setIsAddRewardPanelDirty(false)
        }}
      />
    </>
  )
}

const AddRewardButtonWrapper = (): JSX.Element => (
  <AddRewardProvider>
    <AddRewardButton />
  </AddRewardProvider>
)

export default AddRewardButtonWrapper
