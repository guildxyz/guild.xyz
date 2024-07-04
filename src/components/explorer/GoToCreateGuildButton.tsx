import { useBreakpointValue } from "@chakra-ui/react"
import { Plus } from "@phosphor-icons/react"
import { useIsTabsStuck } from "components/[guild]/Tabs"
import Button from "components/common/Button"
import Link from "next/link"

const GoToCreateGuildButton = () => {
  const { isStuck } = useIsTabsStuck()
  const label = useBreakpointValue({ base: "Create", sm: "Create guild" })

  return (
    <Button
      as={Link}
      leftIcon={<Plus />}
      size="sm"
      variant="ghost"
      colorScheme={isStuck ? "gray" : "whiteAlpha"}
      href="/create-guild"
      flexShrink={0}
      prefetch={false}
    >
      {label}
    </Button>
  )
}

export default GoToCreateGuildButton
