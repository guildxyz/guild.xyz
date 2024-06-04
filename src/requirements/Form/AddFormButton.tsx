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
import { useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import CreateFormModal from "./CreateFormModal"

const AddFormButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const { selection, setSelection, step, setStep, isOpen, onOpen, onClose } =
    useAddRewardContext()

  const methods = useForm<AddRewardForm>({
    defaultValues,
  })

  const visibility = useWatch({ name: "visibility", control: methods.control })

  const handleOpen = () => {
    onOpen()
    setStep("REWARD_SETUP")
  }

  useEffect(() => {
    setSelection("FORM")
  }, [setSelection])

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
            <SelectRolePanel onSuccess={onSuccess} />
          </Modal>
        )}
      </FormProvider>
    </>
  )
}

const AddFormButtonWrapper = ({ onSuccess }: { onSuccess: () => void }) => (
  <AddRewardProvider>
    <AddFormButton onSuccess={onSuccess} />
  </AddRewardProvider>
)

export default AddFormButtonWrapper
