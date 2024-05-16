import { HStack, Icon, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import FeesTable from "components/[guild]/Requirements/components/GuildCheckout/components/FeesTable"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { X } from "phosphor-react"
import rewards from "platforms/rewards"
import { REQUIREMENT_PROVIDED_VALUES } from "requirements/requirements"
import { PlatformType, Requirement, RolePlatform } from "types"

type Props = {
  requirement: Requirement
  rolePlatform: RolePlatform
}

const DynamicRewardCalculationTable = ({ requirement, rolePlatform }: Props) => {
  const { reqAccesses } = useRoleMembership(rolePlatform.roleId)
  const { amount: reqProvidedValue } =
    reqAccesses?.find((req) => req.requirementId === requirement.id) ?? {}

  const rewardName = rolePlatform.guildPlatform.platformGuildData.name
  const dynamicAmount: any = rolePlatform.dynamicAmount
  const { addition, multiplier } = dynamicAmount.operation.params

  const total = reqProvidedValue * multiplier + addition

  const propsHook =
    rewards[PlatformType[rolePlatform.guildPlatform.platformId]]?.cardPropsHook
  const { image = null } = propsHook ? propsHook(rolePlatform.guildPlatform) : {}

  const ProvidedValueDisplay = REQUIREMENT_PROVIDED_VALUES[requirement?.type]

  return (
    <>
      <FeesTable
        buttonComponent={
          <HStack w="full">
            <HStack spacing={1}>
              <Text fontWeight={"semibold"}>Claimable reward</Text>
            </HStack>

            <Skeleton
              ml="auto"
              height={7}
              isLoaded={!isNaN(total)}
              display={"flex"}
              alignItems={"center"}
              gap={1}
            >
              <OptionImage img={image} alt={`${rewardName} image`} ml="auto" />{" "}
              <Text>
                {total} {rewardName}
              </Text>
            </Skeleton>
          </HStack>
        }
      >
        <Tr>
          <Td
            sx={{ fontSize: "sm !important", "& *": { fontSize: "sm !important" } }}
          >
            <ProvidedValueDisplay requirement={requirement} />
          </Td>
          <Td isNumeric>{reqProvidedValue}</Td>
        </Tr>

        <Tr>
          <Td>Multiplier</Td>
          <Td isNumeric>
            <Icon boxSize={3} mb={"-1px"} as={X} /> {multiplier}
          </Td>
        </Tr>

        <Tr>
          <Td>Total</Td>
          <Td isNumeric color="var(--chakra-colors-chakra-body-text)">
            {total} {rewardName}
          </Td>
        </Tr>
      </FeesTable>
    </>
  )
}

export default DynamicRewardCalculationTable
