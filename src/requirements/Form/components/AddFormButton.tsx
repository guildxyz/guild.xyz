import { Button } from "@chakra-ui/react"
import { ADD_REWARD_FORM_DEFAULT_VALUES } from "components/[guild]/AddRewardButton/constants"
import { AddRewardForm } from "components/[guild]/AddRewardButton/types"
import {
  AddRewardProvider,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import CreateFormModal from "./CreateFormModal"

const AddFormButton = ({ isDisabled }) => {
  const { setSelection, step, setStep, isOpen, onOpen, onClose } =
    useAddRewardContext()

  const methods = useForm<AddRewardForm>({
    defaultValues: ADD_REWARD_FORM_DEFAULT_VALUES,
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

  return (
    <FormProvider {...methods}>
      <Button
        size="xs"
        variant="ghost"
        borderRadius={"lg"}
        onClick={handleOpen}
        isDisabled={isDisabled}
      >
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
            if (roleName) methods.setValue("roleName", roleName)
            if (requirements?.length > 0) {
              methods.setValue("requirements", requirements)
            }
            setStep("SELECT_ROLE")
          }}
        />
      )}
    </FormProvider>
  )
}

const AddFormButtonWrapper = (props) => (
  <AddRewardProvider>
    <AddFormButton {...props} />
  </AddRewardProvider>
)

export default AddFormButtonWrapper
