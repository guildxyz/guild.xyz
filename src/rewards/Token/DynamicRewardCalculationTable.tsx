import { HStack, Icon, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import { LockSimple, X } from "@phosphor-icons/react"
import FeesTable from "components/[guild]/Requirements/components/GuildCheckout/components/FeesTable"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { REQUIREMENT_PROVIDED_VALUES } from "requirements/requirementProvidedValues"
import { cardPropsHooks } from "rewards/cardPropsHooks"
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
    cardPropsHooks[PlatformType[rolePlatform.guildPlatform.platformId]]

  const { image = null } = propsHook ? propsHook(rolePlatform.guildPlatform) : {}
  const ImageComponent =
    typeof image === "string" ? (
      <OptionImage img={image} alt={`${rewardName} image`} ml="auto" />
    ) : (
      image
    )

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
              {dynamicUserAmount !== undefined ? (
                <>
                  {ImageComponent}
                  <Text>
                    {dynamicUserAmount} {rewardName}
                  </Text>
                </>
              ) : (
                <JoinToCalculate />
              )}
            </Skeleton>
          </HStack>
        }
      >
        <Tr>
          <Td
            sx={{ fontSize: "sm !important", "& *": { fontSize: "sm !important" } }}
            whiteSpace={"normal"}
          >
            {!!requirement && <ProvidedValueDisplay requirement={requirement} />}
          </Td>
          <Td isNumeric>{rawProvidedUserAmount ?? <JoinToCalculate />}</Td>
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
            {dynamicUserAmount !== undefined ? (
              `${dynamicUserAmount} ${rewardName}`
            ) : (
              <JoinToCalculate />
            )}
          </Td>
        </Tr>
      </FeesTable>
    </>
  )
}

const JoinToCalculate = () => (
  <Text colorScheme={"gray"}>
    <Icon as={LockSimple} mr="1" mb="-3px" />
    Join to calculate
  </Text>
)

export default DynamicRewardCalculationTable
