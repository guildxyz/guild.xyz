import { Anchor } from "@/components/ui/Anchor"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import useNooxBadge from "./hooks/useNooxBadge"

const NooxRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { badgeMetaData, isError, isLoading } = useNooxBadge(requirement.data.id)

  return (
    <Requirement
      image={badgeMetaData?.image_thumbnail?.replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      )}
      isImageLoading={isLoading}
      {...props}
    >
      <span>{"Have the "}</span>
      {!badgeMetaData || isLoading || isError ? (
        <DataBlock
          isLoading={isLoading}
          error={isError ? "Couldn't fetch Noox badge data" : undefined}
        >
          {`#${requirement.data.id}`}
        </DataBlock>
      ) : (
        <Anchor
          href={`https://noox.world/badge/${requirement.data.id}`}
          variant="highlighted"
          showExternal
          target="_blank"
        >
          {badgeMetaData.name}
        </Anchor>
      )}

      <span>{" Noox badge"}</span>
    </Requirement>
  )
}

export default NooxRequirement
