import { Link } from "@chakra-ui/react"
import useSpace from "../hooks/useSpace"

const SnapshotSpaceLink = ({ requirement }) => {
  const { space } = useSpace(requirement.data.space)

  return (
    <Link
      href={`https://snapshot.org/#/${requirement.data.space}`}
      isExternal
      colorScheme="blue"
      fontWeight="medium"
    >
      {`${space?.name ?? requirement.data.space} Snapshot space`}
    </Link>
  )
}

export default SnapshotSpaceLink
