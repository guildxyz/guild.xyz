import { Link } from "@chakra-ui/react"
import useIsIOS from "hooks/useIsIOS"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
  withIntent?: boolean
}

const TwitterUserLink = ({ requirement, withIntent }: Props) => {
  const isIOS = useIsIOS()

  return (
    <Link
      href={`https://x.com/${
        withIntent && !isIOS ? "intent/follow?screen_name=" : ""
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
      }${requirement.data.id}`}
      isExternal
      colorScheme="blue"
      fontWeight="medium"
    >
      {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
      @{requirement.data.id}
    </Link>
  )
}

export default TwitterUserLink
