import { HStack, Icon, Link, Text, useColorModeValue } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { Warning } from "phosphor-react"
import { useGalaxyCampaign } from "./hooks/useGalaxyCampaigns"

const GalaxyRequirement = (props: RequirementProps): JSX.Element => {
  const warningTextColor = useColorModeValue("orange.600", "orange.200")
  const requirement = useRequirementContext()

  const { campaign, isLoading } = useGalaxyCampaign(requirement?.data?.galaxyId)

  return (
    <Requirement
      image={campaign?.thumbnail}
      isImageLoading={isLoading}
      {...props}
      footer={
        <HStack
          alignItems="start"
          spacing={1}
          color={warningTextColor}
          fontSize="sm"
        >
          <Icon as={Warning} mt={1} />
          <Text as="span">Galxe API currently unavailable</Text>
        </HStack>
      }
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
