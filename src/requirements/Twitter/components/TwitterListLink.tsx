import { Icon, Link } from "@chakra-ui/react"
import { PiArrowSquareOut } from "react-icons/pi"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
}

export default function TwitterListLink({ requirement }: Props) {
  return (
    <Link
      href={`https://twitter.com/i/lists/${requirement.data.id}`}
      isExternal
      colorScheme={"blue"}
      fontWeight="medium"
    >
      this X list
      <Icon as={PiArrowSquareOut} mx="1" />
    </Link>
  )
}
