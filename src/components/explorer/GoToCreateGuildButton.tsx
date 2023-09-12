import { useBreakpointValue } from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import { useIsTabsStuck } from "components/[guild]/Tabs"
import { Plus } from "phosphor-react"

const GoToCreateGuildButton = () => {
  const { isStuck } = useIsTabsStuck()
  const label = useBreakpointValue({ base: "Create", sm: "Create guild" })

  return (
    <LinkButton
      leftIcon={<Plus />}
      size="sm"
      variant="ghost"
      colorScheme={isStuck ? "gray" : "whiteAlpha"}
      href="/create-guild"
      flexShrink={0}
    >
      {label}
    </LinkButton>
  )
}

export default GoToCreateGuildButton
