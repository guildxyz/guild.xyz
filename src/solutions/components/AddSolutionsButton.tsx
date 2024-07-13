import { Plus } from "@phosphor-icons/react/Plus"
import {
  AddRewardProvider,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import { useIsTabsStuck } from "components/[guild]/Tabs"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import AddSolutionsModal from "./AddSolutionsModal"

const AddSolutionsButton = () => {
  const { onOpen } = useAddRewardContext()

  const { isStuck } = useIsTabsStuck()
  const { textColor = null, buttonColorScheme = null } = useThemeContext() || {}

  return (
    <>
      <Button
        leftIcon={<Plus />}
        onClick={onOpen}
        variant="ghost"
        size="sm"
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

const AddSolutionsButtonWrapper = (): JSX.Element => (
  <AddRewardProvider>
    <AddSolutionsButton />
  </AddRewardProvider>
)

export default AddSolutionsButtonWrapper
