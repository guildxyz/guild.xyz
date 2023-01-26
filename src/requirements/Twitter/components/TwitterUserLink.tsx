import { Link } from "@chakra-ui/react"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
}

export default function TwitterUserLink({ requirement }: Props) {
  return (
    <Link
      href={`https://twitter.com/${requirement.data.id}`}
      isExternal
      colorScheme={"blue"}
      fontWeight="medium"
    >
      @{requirement.data.id}
    </Link>
  )
}
