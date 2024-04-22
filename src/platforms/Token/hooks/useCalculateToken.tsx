import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import useMembership from "components/explorer/hooks/useMembership"
import useTokenData from "hooks/useTokenData"
import { GuildPlatform, RolePlatform } from "types"
import { useAccount } from "wagmi"
import useClaimedAmount from "./useTokenClaimedAmount"

const calcRequirementAmount = (
  requirement: any,
  dynamicAmount: any,
  address: `0x${string}`
) => {
  let leaderboardValue = 0
  try {
    leaderboardValue =
      requirement.data.snapshot.find(
        (entry) => entry.key.toLowerCase() === address.toLowerCase()
      ).value || null
  } catch {
    leaderboardValue = 0
  }
  if (!leaderboardValue) return 0

  return (
    leaderboardValue * dynamicAmount?.operation?.params.multiplier +
    dynamicAmount?.operation?.params.addition
  )
}

const useCalculateForRolePlatform = (rolePlatform: RolePlatform) => {
  const { address } = useAccount()

  const dynamicAmount = rolePlatform.dynamicAmount

  const { chain, poolId, tokenAddress } =
    rolePlatform.guildPlatform.platformGuildData

  const {
    data: { decimals },
  } = useTokenData(chain, tokenAddress)

  const { data: alreadyClaimed } = useClaimedAmount(
    chain,
    poolId,
    [rolePlatform.id],
    decimals
  )

  const { data: requirements } = useRequirements(
    dynamicAmount?.operation?.input?.[0]?.roleId
  )
  const req = requirements?.find(
    (r) => r.id === dynamicAmount?.operation?.input?.[0]?.requirementId
  )

  const rewardType = dynamicAmount?.operation?.input?.[0]?.type

  const getSum = () => {
    switch (rewardType) {
      case "STATIC":
        return dynamicAmount.operation.input[0].value
      case "REQUIREMENT_AMOUNT":
        return calcRequirementAmount(req, dynamicAmount, address)
      case "REQUIREMENT_ACCESS":
        return 0
      default:
        return 0
    }
  }

  return getSum() - (alreadyClaimed?.[0] || 0)
}

const useCalculateClaimableTokens = (guildPlatform: GuildPlatform) => {
  const { address } = useAccount()
  const { roles } = useGuild()

  const getRequirement = (roleId: number, requirementId: number) => {
    const role: any = roles.find((r) => r.id === roleId)
    return role?.requirements?.find((req) => req.id === requirementId) || null
  }

  const calculateFromDynamicAmount = (dynamicAmount: any) => {
    const rewardType = dynamicAmount?.operation?.input?.[0]?.type
    const roleId = dynamicAmount?.operation?.input?.[0]?.roleId
    const requirementId = dynamicAmount?.operation?.input?.[0]?.requirementId
    const req = getRequirement(roleId, requirementId)

    switch (rewardType) {
      case "STATIC":
        return dynamicAmount.operation.input[0].value
      case "REQUIREMENT_AMOUNT":
        return calcRequirementAmount(req, dynamicAmount, address)
      case "REQUIREMENT_ACCESS":
        // TODO
        return 0
      default:
        return 0
    }
  }

  const { roleIds } = useMembership()

  const getRolePlatforms = () =>
    roles
      ?.flatMap((role) => role.rolePlatforms)
      ?.filter(
        (rp) =>
          rp?.guildPlatformId === guildPlatform.id ||
          rp?.guildPlatform?.id === guildPlatform.id
      )
      .filter((rp) => roleIds?.includes(rp.roleId) || false)

  const {
    data: { decimals },
  } = useTokenData(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.tokenAddress
  )

  const { data: alreadyClaimedAmounts } = useClaimedAmount(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.poolId,
    getRolePlatforms().map((rp) => rp.id),
    decimals
  )

  const getValue = () => {
    const rolePlatforms = getRolePlatforms()

    const sum = rolePlatforms.reduce(
      (acc, rolePlatform) =>
        acc + calculateFromDynamicAmount(rolePlatform.dynamicAmount),
      0
    )

    const alreadyClaimed =
      alreadyClaimedAmounts?.reduce((acc, amount) => acc + amount) || 0

    return sum - alreadyClaimed
  }

  return { getValue }
}

export { useCalculateClaimableTokens, useCalculateForRolePlatform }
