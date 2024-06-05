import { Button, Modal, ModalOverlay } from "@chakra-ui/react"
import {
  AddRewardForm,
  defaultValues,
} from "components/[guild]/AddRewardButton/AddRewardButton"
import SelectRolePanel from "components/[guild]/AddRewardButton/SelectRolePanel"
import {
  AddRewardProvider,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import CreateFormModal from "./CreateFormModal"

const AddFormButton = ({ baseFieldPath }: { baseFieldPath: string }) => {
  const { setSelection, step, setStep, isOpen, onOpen, onClose } =
    useAddRewardContext()

  const methods = useForm<AddRewardForm>({
    defaultValues,
  })

  const visibility = useWatch({ name: "visibility", control: methods.control })

  const handleOpen = () => {
    /**
     * This order is important, as onOpen sets default step and selection as well,
     * that we have to overwrite
     */
    onOpen()
    setStep("REWARD_SETUP")
    setSelection("FORM")
  }

  const { setValue } = useFormContext()

  const handleSuccess = (res: any) => {
    const formId =
      res?.platformGuildData?.formId ??
      res?.createdGuildPlatforms?.[0]?.platformGuildData?.formId
    setValue(`${baseFieldPath}.data.id`, formId, {
      shouldDirty: true,
    })
  }

  return (
    <FormProvider {...methods}>
      <Button size="xs" variant="ghost" borderRadius={"lg"} onClick={handleOpen}>
        Create new
      </Button>

      {step === "REWARD_SETUP" && (
        <CreateFormModal
          onClose={onClose}
          isOpen={isOpen}
          onAdd={(createdRolePlatform) => {
            const {
              roleName = null,
              requirements = null,
              ...rest
            } = createdRolePlatform
            methods.setValue("rolePlatforms.0", {
              ...rest,
              visibility,
            })
            if (roleName) methods.setValue("name", roleName)
            if (requirements?.length > 0) {
              methods.setValue("requirements", requirements)
            }
            setStep("SELECT_ROLE")
          }}
        />
      )}

      {step === "SELECT_ROLE" && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={"2xl"}
          scrollBehavior="inside"
          colorScheme="dark"
        >
          <ModalOverlay />
          <SelectRolePanel onSuccess={handleSuccess} />
        </Modal>
      )}
    </FormProvider>
  )
}

const AddFormButtonWrapper = ({ baseFieldPath }: { baseFieldPath: string }) => (
  <AddRewardProvider>
    <AddFormButton baseFieldPath={baseFieldPath} />
  </AddRewardProvider>
)

export default AddFormButtonWrapper
