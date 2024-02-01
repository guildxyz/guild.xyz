import { Link } from "@chakra-ui/react"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
  withIntent?: boolean
}

export default function TwitterUserLink({ requirement, withIntent }: Props) {
  return (
    <Link
      href={`https://twitter.com/${withIntent ? "intent/follow?id=" : ""}${
        requirement.data.id
      }`}
      isExternal
      colorScheme="blue"
      fontWeight="medium"
    >
      @{requirement.data.id}
    </Link>
  )
}
