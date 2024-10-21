import { Anchor } from "@/components/ui/Anchor"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import { Space } from "../types"

type SnapshotRequirementsWithDataSpace =
  | "SNAPSHOT_FOLLOW"
  | "SNAPSHOT_SPACE_ADMIN"
  | "SNAPSHOT_SPACE_AUTHOR"
  | "SNAPSHOT_FOLLOW_SINCE"
  | "SNAPSHOT_VOTES"
  | "SNAPSHOT_PROPOSALS"
  | "SNAPSHOT_STRATEGY"

export type SnapshotSpaceLinkProps = {
  requirement: Extract<Requirement, { type: SnapshotRequirementsWithDataSpace }>
}

const SnapshotSpaceLink = ({ requirement }: SnapshotSpaceLinkProps) => {
  const { data: space } = useSWRImmutable<Space>(
    `/v2/third-party/snapshot/spaces/${requirement.data.space}`
  )

  return (
    <Anchor
      href={`https://snapshot.org/#/${requirement.data.space}`}
      variant="highlighted"
      showExternal
      target="_blank"
    >
      {`${space?.name ?? requirement.data.space} Snapshot space`}
    </Anchor>
  )
}

export { SnapshotSpaceLink }
