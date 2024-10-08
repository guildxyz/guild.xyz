import { Anchor } from "@/components/ui/Anchor"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import { useGalaxyCampaign } from "./hooks/useGalaxyCampaigns"

const GalaxyRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<"GALAXY" | "GALAXY_PARTICIPATION">()

  const { campaign, isLoading } = useGalaxyCampaign(requirement.data.galaxyId)

  return (
    <Requirement image={campaign?.thumbnail} isImageLoading={isLoading} {...props}>
      <span>
        {requirement.type === "GALAXY_PARTICIPATION"
          ? "Participate in the "
          : "Hold a(n) "}
      </span>
      {!campaign || isLoading ? (
        <DataBlock
          isLoading={isLoading}
          error={
            !campaign && !isLoading
              ? "API error, please contact Galxe to report."
              : undefined
          }
        >
          {requirement.data.galaxyId}
        </DataBlock>
      ) : (
        <Anchor
          href={`https://app.galxe.com/quest/${campaign.space?.alias}/${campaign.id}`}
          showExternal
          variant="highlighted"
          className="break-words"
        >
          {campaign.name}
        </Anchor>
      )}
      <span>
        {requirement.type === "GALAXY_PARTICIPATION"
          ? " Galxe campaign"
          : " Galxe NFT"}
      </span>
    </Requirement>
  )
}

export default GalaxyRequirement
