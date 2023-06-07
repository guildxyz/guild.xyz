import { Link, Text } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useGalaxyCampaign } from "./hooks/useGalaxyCampaigns"

const GalaxyRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const { campaign, isLoading } = useGalaxyCampaign(requirement?.data?.galaxyId)

  return (
    <Requirement image={campaign?.thumbnail} isImageLoading={isLoading} {...props}>
      <Text as="span">
        {requirement.type === "GALAXY_PARTICIPATION"
          ? `Participate in the `
          : "Hold a(n) "}
      </Text>
      {!campaign || isLoading ? (
        <DataBlock
          isLoading={isLoading}
          error={
            !campaign && !isLoading && "API error, please contact Galxe to report."
          }
        >
          {requirement.data.galaxyId}
        </DataBlock>
      ) : (
        <Link
          href={`https://galxe.com/${campaign.space.alias}/campaign/${campaign.id}`}
          isExternal
          display="inline"
          colorScheme="blue"
          fontWeight="medium"
        >
          {campaign.name}
        </Link>
      )}
      <Text as="span">
        {requirement.type === "GALAXY_PARTICIPATION"
          ? " Galxe campaign"
          : " Galxe NFT"}
      </Text>
    </Requirement>
  )
}

export default GalaxyRequirement
