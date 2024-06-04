import { Button, Modal, ModalOverlay, Text } from "@chakra-ui/react"
import {
  AddRewardForm,
  defaultValues,
} from "components/[guild]/AddRewardButton/AddRewardButton"
import SelectRolePanel from "components/[guild]/AddRewardButton/SelectRolePanel"
import {
  AddRewardProvider,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import CreateFormModal from "./CreateFormModal"

const AddFormButton = ({ onSuccess }: { onSuccess: (formId: number) => void }) => {
  const { setSelection, step, setStep, isOpen, onOpen, onClose } =
    useAddRewardContext()

  const methods = useForm<AddRewardForm>({
    defaultValues,
  })

  const visibility = useWatch({ name: "visibility", control: methods.control })

  const handleOpen = () => {
    // This order is important, as onOpen sets
    // default step and selection as well, that
    // we have to overwrite
    onOpen()
    setStep("REWARD_SETUP")
    setSelection("FORM")
  }

  const handleSuccess = (res: any) => {
    const formId = res?.platformGuildData?.formId
    return onSuccess(formId)
  }

  return (
    <>
      <FormProvider {...methods}>
        <Button size="xs" variant="ghost" borderRadius={"lg"} onClick={handleOpen}>
          <Text colorScheme={"gray"}>Create new</Text>
        </Button>

        {step === "REWARD_SETUP" && (
          <CreateFormModal
            onClose={onClose}
            isOpen={isOpen}
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
    </>
  )
}

const AddFormButtonWrapper = ({
  onSuccess,
}: {
  onSuccess: (formId: number) => void
}) => (
  <AddRewardProvider>
    <AddFormButton onSuccess={onSuccess} />
  </AddRewardProvider>
)

export default AddFormButtonWrapper
