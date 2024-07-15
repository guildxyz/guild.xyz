import { Icon, Link } from "@chakra-ui/react"
import { PiArrowSquareOut } from "react-icons/pi"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
}

export default function TwitterTweetLink({ requirement }: Props) {
  return (
    <Link
      href={`https://x.com/x/status/${requirement.data.id}`}
      isExternal
      colorScheme={"blue"}
      fontWeight="medium"
    >
      this tweet
      <Icon as={PiArrowSquareOut} mx="1" />
    </Link>
  )
}
