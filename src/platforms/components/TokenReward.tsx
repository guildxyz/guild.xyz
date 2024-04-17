import {
  Circle,
  Flex,
  Icon,
  Spinner,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react"
import { useAccessedGuildPoints } from "components/[guild]/AccessHub/hooks/useAccessedGuildPoints"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import useRequirements from "components/[guild]/hooks/useRequirements"
import GuildLogo from "components/common/GuildLogo"
import { ArrowRight } from "phosphor-react"
import {
  TokenRewardProvider,
  useTokenRewardContext,
} from "platforms/Token/TokenRewardContext"
import { useCalculateFromDynamic } from "platforms/Token/hooks/useCalculateToken"
import Star from "static/icons/star.svg"
import { RolePlatform } from "types"

const TokenConversionTag = ({ platform }: { platform: RolePlatform }) => {
  const { rewardImageUrl } = useTokenRewardContext()

  const calcDynamic = () => {
    const operation: any = platform.dynamicAmount.operation
    const params = operation.params
    return params?.multiplier + params?.addition
  }

  const { data: requirements } = useRequirements(
    platform.dynamicAmount?.operation?.input?.[0]?.roleId
  )
  const req = requirements?.find(
    (r) => r.id === platform.dynamicAmount?.operation?.input?.[0]?.requirementId
  )

  const pointsTypeId = req?.data?.guildPlatformId

  const accessedPoints = useAccessedGuildPoints("ALL")

  const pointType = accessedPoints?.find((ap) => ap.id === pointsTypeId)
  const bgColor = useColorModeValue("gray.800", "gray.700")

  return (
    <>
      <Tag width={"fit-content"}>
        {pointType?.platformGuildData.imageUrl ? (
          <>
            <GuildLogo
              imageUrl={pointType.platformGuildData.imageUrl}
              size={"16px"}
              mr={1}
            />
          </>
        ) : (
          <Circle size={5} bgColor={bgColor} mr={1} p={"4px"}>
            <Star color="white" />
          </Circle>
        )}
        1 <Icon as={ArrowRight} boxSize={"10px"} ml={2} />{" "}
        <GuildLogo imageUrl={rewardImageUrl} size={"16px"} mr={1} ml={2} />{" "}
        {calcDynamic()}
      </Tag>
    </>
  )
}

const TokenReward = ({ platform }: { platform: RolePlatform }) => {
  const { rewardImageUrl, isTokenLoading, token } = useTokenRewardContext()

  const { getValue } = useCalculateFromDynamic(platform.dynamicAmount)
  const claimableAmount = getValue()

  const tokenRewardType = platform.dynamicAmount.operation.input[0].type

  return (
    <Flex alignItems={"center"}>
      <RewardDisplay
        icon={
          isTokenLoading ? (
            <Spinner boxSize={6} />
          ) : (
            <RewardIcon
              rolePlatformId={platform.id}
              guildPlatform={platform?.guildPlatform}
              owerwriteImg={rewardImageUrl}
            />
          )
        }
        label={`Claim: ${claimableAmount || ""} ${token?.symbol || "tokens"}`}
        whiteSpace={"nowrap"}
        pt={0}
        mr={2}
      />
      {tokenRewardType === "REQUIREMENT_AMOUNT" && (
        <TokenConversionTag platform={platform} />
      )}
    </Flex>
  )
}

const TokenRewardWrapper = ({ platform }: RewardProps) => {
  return (
    <TokenRewardProvider
      tokenReward={{
        chain: platform?.guildPlatform?.platformGuildData?.chain,
        address: platform?.guildPlatform?.platformGuildData?.tokenAddress,
        rewardsByRoles: [
          {
            rewards: [
              { rolePlatform: platform, guildPlatform: platform?.guildPlatform },
            ],
          },
        ],
      }}
    >
      <TokenReward platform={platform} />
    </TokenRewardProvider>
  )
}

export default TokenRewardWrapper
