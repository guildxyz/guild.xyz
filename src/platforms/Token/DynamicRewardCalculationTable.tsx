import { HStack, Icon, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import FeesTable from "components/[guild]/Requirements/components/GuildCheckout/components/FeesTable"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { X } from "phosphor-react"
import rewards from "platforms/rewards"
import { REQUIREMENT_PROVIDED_VALUES } from "requirements/requirements"
import { PlatformType, Requirement, RolePlatform } from "types"
import useDynamicRewardUserAmount from "./hooks/useDynamicRewardUserAmount"

type Props = {
  requirement: Requirement
  rolePlatform: RolePlatform
}

const DynamicRewardCalculationTable = ({ requirement, rolePlatform }: Props) => {
  const { rawProvidedUserAmount, dynamicUserAmount, isLoading } =
    useDynamicRewardUserAmount(rolePlatform)

  const rewardName = rolePlatform.guildPlatform.platformGuildData.name

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
              isLoaded={!isLoading}
              display={"flex"}
              alignItems={"center"}
              gap={1}
            >
              <OptionImage img={image} alt={`${rewardName} image`} ml="auto" />{" "}
              <Text>
                {dynamicUserAmount ?? "some"} {rewardName}
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
          <Td isNumeric>{rawProvidedUserAmount}</Td>
        </Tr>

        <Tr>
          <Td>Multiplier</Td>
          <Td isNumeric>
            <Icon boxSize={3} mb={"-1px"} as={X} />{" "}
            {(rolePlatform.dynamicAmount.operation as any).params.multiplier}
          </Td>
        </Tr>

        <Tr>
          <Td>Total</Td>
          <Td isNumeric color="var(--chakra-colors-chakra-body-text)">
            {dynamicUserAmount} {rewardName}
          </Td>
        </Tr>
      </FeesTable>
    </>
  )
}

export default DynamicRewardCalculationTable
