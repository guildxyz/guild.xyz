import { Icon, Link } from "@chakra-ui/react"
import { ArrowSquareOut } from "phosphor-react"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
}

export default function TwitterListLink({ requirement }: Props) {
  return (
    <Link
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      href={`https://twitter.com/i/lists/${requirement.data.id}`}
      isExternal
      colorScheme={"blue"}
      fontWeight="medium"
    >
      this X list
      <Icon as={ArrowSquareOut} mx="1" />
    </Link>
  )
}
