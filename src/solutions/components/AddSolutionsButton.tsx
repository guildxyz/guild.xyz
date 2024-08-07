import { ButtonProps } from "@chakra-ui/react"
import { Plus } from "@phosphor-icons/react"
import {
  AddRewardProvider,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import Button from "components/common/Button"
import AddSolutionsModal from "./AddSolutionsModal"

const AddSolutionsButton = (buttonProps: ButtonProps) => {
  const { onOpen } = useAddRewardContext()

  return (
    <>
      <Button leftIcon={<Plus />} onClick={onOpen} {...buttonProps}>
        Add solution
      </Button>
      <AddSolutionsModal />
    </>
  )
}

const AddSolutionsButtonWrapper = (buttonProps: ButtonProps): JSX.Element => (
  <AddRewardProvider>
    <AddSolutionsButton {...buttonProps} />
  </AddRewardProvider>
)

export default AddSolutionsButtonWrapper
