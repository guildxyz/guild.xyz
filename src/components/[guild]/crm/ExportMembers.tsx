import { useBreakpointValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import { Export } from "phosphor-react"
import { useIsTabsStuck } from "../Tabs/Tabs"

const ExportMembers = () => {
  const { isStuck } = useIsTabsStuck()
  const label = useBreakpointValue({ base: "Export", md: "Export members" })

  return (
    <Button
      leftIcon={<Export />}
      variant="ghost"
      colorScheme={isStuck ? "gray" : "whiteAlpha"}
      size="sm"
    >
      {label}
    </Button>
  )
}

export default ExportMembers
