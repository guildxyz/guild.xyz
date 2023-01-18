import { Link, Text } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import Requirement from "../common/Requirement"
import { useGalaxyCampaign } from "./hooks/useGalaxyCampaigns"

const GalaxyRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => {
  const { campaign, isLoading } = useGalaxyCampaign(requirement?.data?.galaxyId)

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={campaign?.thumbnail}
      isImageLoading={isLoading}
      {...rest}
    >
      <Text as="span">{`Participate in the `}</Text>
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
      <Text as="span">{` Galxe campaign`}</Text>
    </Requirement>
  )
}

export default GalaxyRequirement
