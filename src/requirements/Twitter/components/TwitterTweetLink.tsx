import { Link } from "@chakra-ui/react"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
}

export default function TwitterTweetLink({ requirement }: Props) {
  return (
    <Link
      href={`https://twitter.com/twitter/status/${requirement.data.id}`}
      isExternal
      colorScheme={"blue"}
      fontWeight="medium"
    >
      this tweet
    </Link>
  )
}
