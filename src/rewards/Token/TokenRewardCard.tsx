import { Circle, Img, Text, useColorModeValue } from "@chakra-ui/react"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import RewardCard from "components/common/RewardCard"
import useMembership from "components/explorer/hooks/useMembership"
import dynamic from "next/dynamic"
import { useMemo } from "react"
import rewards from "rewards"
import { GuildPlatform } from "types"
import ClaimTokenButton from "./ClaimTokenButton"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"
import { useClaimableTokens } from "./hooks/useCalculateToken"
import useRolePlatformsOfReward from "./hooks/useRolePlatformsOfReward"
import useTokenClaimedAmount from "./hooks/useTokenClaimedAmount"

const DynamicTokenRewardCardEditMenu = dynamic(
  () => import("./TokenRewardCardEditMenu")
)

const TokenRewardCard = () => {
  const { isAdmin } = useGuildPermission()
  const { token, guildPlatform, imageUrl } = useTokenRewardContext()
  const claimableAmount = useClaimableTokens(guildPlatform)

  const { roles } = useGuild()
  const { roleIds } = useMembership()

  const rolePlatforms = useRolePlatformsOfReward(guildPlatform.id)
  const rolePlatformIds = useMemo(
    () =>
      rolePlatforms
        .filter((rp) => roleIds?.includes(rp.roleId) || false)
        .map((rp) => rp.id),
    [rolePlatforms, roleIds]
  )

  const { data } = useTokenClaimedAmount(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.poolId,
    rolePlatformIds,
    token.data.decimals
  )
  const alreadyClaimed = data?.reduce((acc, res) => acc + res) || 0

  const bgColor = useColorModeValue("gray.700", "gray.600")

  const title = useMemo(() => {
    if (token.isLoading) return null
    if (claimableAmount === 0) {
      return alreadyClaimed === 0
        ? `Claim ${token.data.symbol}`
        : `Claimed ${alreadyClaimed} ${token.data.symbol}`
    }
    if (claimableAmount > 0) return `Claim ${claimableAmount} ${token.data.symbol}`
  }, [claimableAmount, token, alreadyClaimed])

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
          isAdmin && <DynamicTokenRewardCardEditMenu guildPlatform={guildPlatform} />
        }
        p={{ base: 3, sm: 4 }}
      >
        <ClaimTokenButton
          isDisabled={claimableAmount <= 0}
          rolePlatform={rolePlatforms[0]}
        />
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
