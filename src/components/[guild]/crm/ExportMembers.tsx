import Button from "components/common/Button"
import { Export } from "phosphor-react"
import { useIsTabsStuck } from "../Tabs/Tabs"

const ExportMembers = () => {
  const { isStuck } = useIsTabsStuck()

  return (
    <Button
      leftIcon={<Export />}
      variant="ghost"
      colorScheme={isStuck ? "gray" : "whiteAlpha"}
      size="sm"
    >
      Export members
    </Button>
  )
}

export default ExportMembers
