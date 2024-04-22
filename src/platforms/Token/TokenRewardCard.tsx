import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import RewardCard from "components/common/RewardCard"
import useMembership from "components/explorer/hooks/useMembership"
import rewards from "platforms/rewards"
import { GuildPlatform } from "types"
import TokenCardButton from "./TokenCardButton"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"
import { useCalculateClaimableTokens } from "./hooks/useCalculateToken"
import useClaimedAmount from "./hooks/useTokenClaimedAmount"

const TokenRewardCard = () => {
  const { isAdmin } = useGuildPermission()
  const { token, guildPlatform, imageUrl } = useTokenRewardContext()

  const { getValue } = useCalculateClaimableTokens(guildPlatform)
  const claimableAmount = getValue()

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

  const { data } = useClaimedAmount(
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
            {alreadyClaimed === 0
              ? ``
              : claimableAmount > 0
              ? `Already claimed: ${alreadyClaimed} ${token.data.symbol}`
              : `You have claimed all of your ${token.data.symbol} rewards`}
            {/* TODO: This will not work if multiple rewards are set */}
            <AvailabilityTags
              rolePlatform={roles
                .flatMap((role) => role.rolePlatforms)
                .find((rp) => rp.id === rolePlatformIds[0])}
            />
          </>
        }
        cornerButton={
          isAdmin && (
            <>
              <PlatformCardMenu>
                <RemovePlatformMenuItem
                  platformGuildId={guildPlatform.platformGuildId}
                />
              </PlatformCardMenu>
            </>
          )
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
