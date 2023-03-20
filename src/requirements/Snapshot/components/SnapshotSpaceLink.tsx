import { Link } from "@chakra-ui/react"
import useSWRImmutable from "swr/immutable"
import { Space } from "./SpaceSelect"

const SnapshotSpaceLink = ({ requirement }) => {
  const { data: space } = useSWRImmutable<Space>(
    requirement.data.space
      ? `/assets/snapshot/space/${requirement.data.space}`
      : null
  )

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
