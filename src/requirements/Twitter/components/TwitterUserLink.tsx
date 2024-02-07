import { Link } from "@chakra-ui/react"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
  withIntent?: boolean
}

const TwitterUserLink = ({ requirement, withIntent }: Props) => (
  <Link
    href={`https://twitter.com/${withIntent ? "intent/follow?screen_name=" : ""}${
      requirement.data.id
    }`}
    isExternal
    colorScheme="blue"
    fontWeight="medium"
  >
    @{requirement.data.id}
  </Link>
)

export default TwitterUserLink
