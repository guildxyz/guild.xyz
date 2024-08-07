import { ButtonProps } from "@chakra-ui/react"
import { Plus } from "@phosphor-icons/react"
import {
  AddRewardProvider,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import { useIsTabsStuck } from "components/[guild]/Tabs"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import AddSolutionsModal from "./AddSolutionsModal"

const AddSolutionsButton = (buttonProps: ButtonProps) => {
  const { onOpen } = useAddRewardContext()

  const { isStuck } = useIsTabsStuck()
  const { textColor = null, buttonColorScheme = null } = useThemeContext() || {}

  return (
    <>
      <Button
        leftIcon={<Plus />}
        onClick={onOpen}
        {...buttonProps}
        {...(!isStuck && {
          color: textColor,
          colorScheme: buttonColorScheme,
        })}
      >
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
