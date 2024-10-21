import { Anchor } from "@/components/ui/Anchor"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import { usePoap } from "./hooks/usePoaps"

const PoapRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { poap, isLoading, error } = usePoap(requirement?.data?.id)

  return (
    <Requirement image={poap?.image_url} isImageLoading={isLoading} {...props}>
      <span>{"Own the "}</span>
      {!poap || isLoading || error ? (
        <DataBlock
          isLoading={isLoading}
          error={error && "API error, please contact POAP to report."}
        >
          {requirement.data.id}
        </DataBlock>
      ) : (
        <Anchor
          href={`https://poap.gallery/event/${poap.id}`}
          variant="highlighted"
          showExternal
          target="_blank"
        >
          {poap.name}
        </Anchor>
      )}
      <span>{" POAP"}</span>
    </Requirement>
  )
}

export default PoapRequirement
