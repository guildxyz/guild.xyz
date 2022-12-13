import { Link } from "@chakra-ui/react"
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
      this Twitter list
    </Link>
  )
}
