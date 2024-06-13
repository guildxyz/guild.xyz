import { Icon, Link } from "@chakra-ui/react"
import { ArrowSquareOut } from "phosphor-react"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
}

export default function TwitterTweetLink({ requirement }: Props) {
  return (
    <Link
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      href={`https://x.com/x/status/${requirement.data.id}`}
      isExternal
      colorScheme={"blue"}
      fontWeight="medium"
    >
      this tweet
      <Icon as={ArrowSquareOut} mx="1" />
    </Link>
  )
}
