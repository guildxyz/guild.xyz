import { Link, Text } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import { useGalaxyCampaign } from "./hooks/useGalaxyCampaigns"

const GalaxyRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const { campaign, isLoading } = useGalaxyCampaign(requirement?.data?.galaxyId)

  return (
    <Requirement image={campaign?.thumbnail} isImageLoading={isLoading} {...props}>
      <Text as="span">
        {requirement.type === "GALAXY_PARTICIPATION"
          ? "Participate in the "
          : "Hold a(n) "}
      </Text>
      {!campaign || isLoading ? (
        <DataBlock
          isLoading={isLoading}
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          error={
            !campaign && !isLoading && "API error, please contact Galxe to report."
          }
        >
          {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
          {requirement.data.galaxyId}
        </DataBlock>
      ) : (
        <Link
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
