import { Circle, Img, Text, useColorModeValue } from "@chakra-ui/react"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import RewardCard from "components/common/RewardCard"
import useMembership from "components/explorer/hooks/useMembership"
import rewards from "platforms/rewards"
import { GuildPlatform } from "types"
import TokenCardButton from "./TokenCardButton"
import TokenRewardCardEditMenu from "./TokenRewardCardEditMenu"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"
import { useClaimableTokens } from "./hooks/useCalculateToken"
import useTokenClaimedAmount from "./hooks/useTokenClaimedAmount"

const TokenRewardCard = () => {
  const { isAdmin } = useGuildPermission()
  const { token, guildPlatform, imageUrl } = useTokenRewardContext()
  const claimableAmount = useClaimableTokens(guildPlatform)

  const { roles } = useGuild()
  const { roleIds } = useMembership()

  const rolePlatformIds = roles
    ?.flatMap((role) => role.rolePlatforms)
    ?.filter(
      (rp) =>
        rp?.guildPlatformId === guildPlatform.id ||
        rp?.guildPlatform?.id === guildPlatform.id
    )
    .filter((rp) => roleIds?.includes(rp.roleId) || false)
    .map((rp) => rp.id)

  const { data } = useTokenClaimedAmount(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.poolId,
    rolePlatformIds,
    token.data.decimals
  )
  const alreadyClaimed = data?.reduce((acc, res) => acc + res) || 0

  const bgColor = useColorModeValue("gray.700", "gray.600")

  const title = token.isLoading
    ? null
    : claimableAmount > 0
    ? `Claim ${claimableAmount} ${token.data.symbol}`
    : `Claimed ${alreadyClaimed} ${token.data.symbol}`

  return (
    <>
      <RewardCard
        label={rewards.ERC20.name}
        title={title}
        colorScheme={"gold"}
        image={
          imageUrl.match("guildLogos") ? (
            <Circle size={10} bgColor={bgColor}>
              <Img src={imageUrl} alt="Guild logo" boxSize="40%" />
            </Circle>
          ) : (
            imageUrl
          )
        }
        description={
          <>
            <Text fontSize="sm" color="GrayText">
              {alreadyClaimed === 0
                ? ``
                : claimableAmount > 0
                ? `Already claimed: ${alreadyClaimed} ${token.data.symbol}`
                : `You have claimed all of your ${token.data.symbol} rewards`}
            </Text>
            {/* TODO: This will not work if multiple rewards are set */}
            <AvailabilityTags
              mt={1}
              rolePlatform={roles
                .flatMap((role) => role.rolePlatforms)
                .find((rp) => rp.id === rolePlatformIds[0])}
            />
          </>
        }
        cornerButton={
          isAdmin && <TokenRewardCardEditMenu guildPlatform={guildPlatform} />
        }
      >
        <TokenCardButton isDisabled={claimableAmount <= 0} />
      </RewardCard>
    </>
  )
}

const TokenRewardCardWrapper = ({ platform }: { platform: GuildPlatform }) => (
  <TokenRewardProvider guildPlatform={platform}>
    <TokenRewardCard />
  </TokenRewardProvider>
)

export { TokenRewardCardWrapper as TokenRewardCard }
